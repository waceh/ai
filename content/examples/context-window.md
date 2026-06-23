---
id: context-window
status: ready
title: "tiktoken으로 입력 길이 확인"
source: "https://github.com/openai/tiktoken/blob/main/README.md"
---

## 시나리오

너무 긴 문서를 한 번에 넣으면 API가 거부하거나 앞부분이 잘립니다. **Context Window** 한도를 넘기 전에 Token 수를 확인합니다.

## 따라하기

1. `tiktoken` 설치 (OpenAI 공식 토크나이저):

```bash
pip install tiktoken
```

2. README 예제로 Token 수를 셉니다:

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
text = "긴 문서 본문..."
tokens = enc.encode(text)
print(len(tokens))
```

3. Anthropic 호출 시 `max_tokens`는 **출력** 상한입니다. 입력 한도는 모델별 Context Window 문서를 확인하세요.

OpenAI Embeddings 가이드: `text-embedding-3-small` 등 모델별 max input tokens가 문서화되어 있습니다 (예: 8192 tokens).

## 핵심 포인트

- Context Window = 모델이 한 번에 처리할 수 있는 Token 상한 (입력+출력 합산 정책은 벤더별로 확인).
- `tiktoken.encoding_for_model()`은 OpenAI 모델용 (README).
- 한도 초과 시 RAG·요약으로 입력을 줄입니다.

## 참고

- tiktoken README: https://github.com/openai/tiktoken/blob/main/README.md
- OpenAI Embeddings guide (모델별 max input): https://platform.openai.com/docs/guides/embeddings
- Anthropic Tool use docs (입력 Token 과금): https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
