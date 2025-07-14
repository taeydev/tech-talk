import bcrypt
from fastapi import Body, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from posts import router as posts_router
from comments import router as comments_router
import os
import httpx
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI()

#CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(posts_router)
app.include_router(comments_router)

# URL 분석 API
@app.post("/analyze-url")
async def analyze_url(url: str = Body(..., embed=True)):
    try:
        # 1. URL에서 HTML 내용 가져오기
        headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; TechTalkBot/1.0)'
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()
        
        # 2. HTML에서 텍스트 내용 추출
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # script, style 태그 제거
        for script in soup(["script", "style"]):
            script.decompose()
        
        # 텍스트 추출
        text_content = soup.get_text()
        
        # 공백 정리
        lines = (line.strip() for line in text_content.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text_content = ' '.join(chunk for chunk in chunks if chunk)
        
        # 텍스트가 너무 길면 앞부분만 사용 (OpenAI 토큰 제한 고려)
        if len(text_content) > 8000:
            text_content = text_content[:8000]
        
        # 3. OpenAI API로 내용 분석
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
        # JSON 응답 파싱 (전처리: strip 및 코드블록 제거)
        import re
        def fix_json_newlines(s: str) -> str:
            # JSON 문자열 내 실제 개행을 \\n으로 치환
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
