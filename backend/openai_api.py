from fastapi import APIRouter, Body, HTTPException
import os
import httpx
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv

router = APIRouter()

# 환경 변수 로드
load_dotenv()

@router.post("/analyze-url")
async def analyze_url(url: str = Body(..., embed=True)):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; TechTalkBot/1.0)'
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        text_content = soup.get_text()
        lines = (line.strip() for line in text_content.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text_content = ' '.join(chunk for chunk in chunks if chunk)
        if len(text_content) > 8000:
            text_content = text_content[:8000]
        prompt = f"""
아래 웹페이지의 내용을 분석해서 title, summary, tags를 뽑아주세요.

- title: 웹페이지의 핵심 주제를 잘 나타내는 간결한 제목 (한국어)
- summary: 배열 형식으로 3~5개의 항목. 각 항목은 "[소제목 이모지] 주제 키워드\\n- 요약 문장 1\\n- 요약 문장 2..." 구조의 string입니다.
    - 각 항목은 서로 다른 핵심 내용을 담아야 하며, 중복 없이 작성
    - 줄바꿈(\\n)으로 소제목과 본문을 구분
    - 각 본문은 실제 웹페이지의 구체적인 정보, 수치, 사례, 인사이트를 포함
    - 각 문장은 반드시 '~습니다'로 끝나는 격식체(존댓말)로 작성해 주세요.
- tags: 웹페이지의 주제, 카테고리, 핵심 키워드를 짧고 명확한 한 단어(한국어 또는 영어)로만 뽑아주세요. 
    - 예: ["AI", "캐싱", "최적화", "추천", "검색", "챗봇"]
    - 문장, 설명, 긴 구문은 절대 포함하지 마세요. 카테고리 범주화할 수 있는 키워드로 뽑아주세요.
    - 최대 5개, 평균 2~3개

줄바꿈은 반드시 항상 (\\n)으로 작성하세요.
아래 JSON 형식으로만 응답해 주세요. 다른 설명, 코드블록( ``` ) 등은 절대 포함하지 마세요.

예시:
{{
  "title": "서비스 혁신 사례",
  "summary": [
    "🚀 혁신 도입\\n- 2023년 5월, 새로운 AI 기술을 도입해 서비스 품질이 30% 향상되었습니다.\\n- 고객 만족도 조사에서 4.8점을 기록했습니다.",
    "💡 자동화 효과\\n- 업무 자동화로 연간 1,000시간의 인건비를 절감했습니다.",
  ],
  "tags": ["AI", "자동화", "고객만족", "Web"]
}}

웹페이지 URL: {url}
내용: {text_content}
"""
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "당신은 웹페이지 내용을 분석하고 요약하는 전문가입니다. 항상 JSON 형식으로 응답하세요."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=500,
        )
        response_text = response.choices[0].message.content
        print("\n[OpenAI 응답 원문]\n", response_text)
        if not response_text:
            raise HTTPException(status_code=500, detail="OpenAI 응답이 비어 있습니다.")
        import re
        def fix_json_newlines(s: str) -> str:
            return re.sub(r'("[^"]*")', lambda m: m.group(0).replace('\n', '\\n'), s)
        cleaned = response_text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-zA-Z]*\n?", "", cleaned)
            cleaned = re.sub(r"```$", "", cleaned)
        cleaned = fix_json_newlines(cleaned)
        print("\n[cleaned]\n", cleaned)
        import json
        try:
            analysis = json.loads(cleaned)
            print("[파싱된 분석 결과]", analysis)
            return {
                "url": url,
                "title": analysis.get("title", "제목 추출 실패"),
                "summary": analysis.get("summary", "요약을 생성할 수 없습니다."),
                "tags": analysis.get("tags", [])
            }
        except json.JSONDecodeError:
            print("[JSON 파싱 실패!] 원문:\n", response_text)
            return {
                "url": url,
                "title": "제목 추출 실패",
                "summary": "요약을 생성할 수 없습니다.",
                "tags": []
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL 분석 실패: {str(e)}")

@router.post("/analyze-post")
async def analyze_post(content: str = Body(..., embed=True)):
    """
    글 내용이 기술 관련 글인지 OpenAI로 판단. 'true'면 True, 그 외는 모두 400 반환
    """
    prompt = f"""
아래 글이 IT, 소프트웨어, 하드웨어, 프로그래밍, 컴퓨터, 인터넷, 기술 트렌드 등 기술과 직접적으로 관련된 내용인지 판단하세요.

다음과 같은 경우에는 모두 'false'로 답하세요:
- 비속어, 욕설, 혐오 표현이 포함된 글
- 명백한 광고, 상업적 홍보, 구매/할인/이벤트/무료 체험/카톡 문의/연락처/링크 등 상업적 목적이 명확한 글
- 도배(의미 없는 반복, 과도한 이모티콘/문자 반복 등)
- 정치, 종교, 일상, 잡담, 기술과 무관한 내용

'true' 또는 'false' 한 단어로만, 다른 말은 절대 하지 마세요.

글: {content}
"""
    import openai
    import os
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 기술 관련 글을 분류하는 전문가입니다. 반드시 'true' 또는 'false'로만 답하세요."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=5,
        )
        content_raw = response.choices[0].message.content
        if not content_raw:
            raise HTTPException(status_code=500, detail="OpenAI 응답이 비어 있습니다.")
        result = content_raw.strip().lower().replace('\n', '').replace('"', '').replace("'", "")
        print(f"[기술 관련 글 여부] GPT 응답: {result}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 판별 실패: {str(e)}")

    if result == "true":
        return {"is_tech": True}
    else:
        raise HTTPException(status_code=400, detail="기술 관련 글이 아닙니다.") 