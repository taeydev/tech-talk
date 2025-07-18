# TechTalk

## 개요

**익명 기술 공유 게시판 TechTalk**은 개발자와 IT 종사자들이 자유롭게 기술 정보를 공유할 수 있는 오픈 커뮤니티 플랫폼입니다.

- 누구나 익명으로 게시글/댓글을 작성할 수 있습니다.
- AI를 활용해 URL만 입력해도 자동으로 기술 요약 게시글을 생성할 수 있습니다.
- 주간 신규 게시글을 이메일로 받아볼 수 있습니다.

## 주요 기능

- **익명 게시글 작성/수정/삭제**  
  비밀번호만 입력하면 누구나 익명으로 게시글을 작성할 수 있습니다. 본인이 입력한 비밀번호로만 게시글을 수정하거나 삭제할 수 있습니다.

- **기술 관련 내용 자동 판별 및 차단**  
  AI가 게시글 내용을 분석해 기술과 무관한 글(잡담, 광고 등)은 자동으로 등록이 차단됩니다.

- **댓글 작성/수정/삭제**  
  게시글마다 익명으로 댓글을 남길 수 있습니다. 댓글도 본인이 입력한 비밀번호로 수정/삭제할 수 있습니다.

- **URL로 AI 요약 글 자동 생성**  
  URL을 입력하면 AI가 해당 페이지의 핵심 내용을 요약해 게시글을 자동으로 만들어줍니다. 제목, 내용 요약, 태그가 자동으로 추출됩니다.

- **Confluence 연동**  
  작성한 게시글은 Confluence 블로그로 자동 업로드됩니다.

- **주간 이메일 발송**  
  매주 월요일, 지난 주 새로 올라온 게시글 목록을 이메일로 자동 발송합니다.

## 사용 기술

- **프론트엔드:** Next.js 15, React 19, TypeScript, TailwindCSS, Zustand
- **백엔드:** FastAPI, SQLAlchemy
- **DB:** MySQL
- **AI:** OpenAI
- **이메일:** SMTP

## 설치 및 실행

### 1. 의존성 설치

#### 프론트엔드

```bash
npm install
```

#### 백엔드

```bash
cd backend
pip install -r requirements.txt
```

#### (선택) 백엔드 가상환경(venv) 구성

파이썬 가상환경을 사용하면 여러 프로젝트의 패키지 충돌을 방지할 수 있습니다.

```bash
# 가상환경 생성 (Windows)
python -m venv venv
venv\\Scripts\\activate

# (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

#### 프론트엔드 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # 로컬 개발 환경
```

- Next.js(프론트엔드)에서 API 서버 주소를 지정합니다.
- 운영 환경에서는 실제 API 서버 주소로 변경하세요.

#### 백엔드 (backend/.env)

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/database_name
OPENAI_API_KEY=your_openai_api_key_here

# 메일 발송을 위한 설정
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
RECIPIENT_EMAILS=recipient1@example.com,recipient2@example.com

# Confluence 연동 설정
CONFLUENCE_BLOG_API_URL=https://your-domain.com/wiki/rest/api/content
CONFLUENCE_EMAIL=your-email@company.com
CONFLUENCE_API_TOKEN=your-confluence-api-token
CONFLUENCE_SPACE_KEY=SPACEKEY
```

### 3. 개발 서버 실행

#### 프론트엔드

```bash
npm run dev
```

#### 백엔드

```bash
cd backend
# (가상환경 활성화)
source venv/bin/activate # Mac/Linux
venv\\Scripts\\activate # Windows

uvicorn main:app --reload
```
