---
id: token
status: ready
title: "tiktoken encode / decode"
source: "https://github.com/openai/tiktoken/blob/main/README.md"
---

## 시나리오

API 과금·Context Window 계산은 글자 수가 아니라 **Token** 수 기준입니다.

## 따라하기

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
assert enc.decode(enc.encode("hello world")) == "hello world"

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("hello world")
print(tokens)
print(enc.decode(tokens))
```

위 코드는 tiktoken README의 공식 예제와 동일합니다.

OpenAI Cookbook "How to count tokens with tiktoken"에 모델별 encoding 표가 있습니다:

| Encoding | OpenAI models |
|----------|---------------|
| `o200k_base` | gpt-4o, gpt-4o-mini |
| `cl100k_base` | gpt-4-turbo, gpt-4, gpt-3.5-turbo, text-embedding-3-small 등 |

## 핵심 포인트

- Token은 LLM이 실제로 보는 텍스트 단위입니다.
- 같은 문장도 모델·encoding마다 Token 수가 다릅니다.
- Streaming도 Token 단위로 출력이 전달됩니다.

## 참고

- tiktoken README: https://github.com/openai/tiktoken/blob/main/README.md
- OpenAI Cookbook, count tokens: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
