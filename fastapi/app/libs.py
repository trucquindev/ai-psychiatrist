from langchain_ollama import OllamaLLM # Ollama model
from langchain_ollama.llms import BaseLLM # Lớp cơ sở của LLM
from langchain.chains.llm import LLMChain # xử lí chuỗi các LLM
from langchain.chains.sql_database.query import create_sql_query_chain # tạo câu truy vấn cơ sở dữ liệu từ llm
from langchain.prompts import PromptTemplate # tạo câu truy vấn từ mẫu
from langchain_community.tools import QuerySQLDataBaseTool # công cụ truy vấn cơ sở dữ liệu
from langchain_community.utilities import SQLDatabase # cơ sở dữ liệu
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser # xử lí kết quả trả về là kiểu dữ liệu chuỗi
from langchain_core.runnables import RunnablePassthrough # truyền đa dạng đối số
from operator import itemgetter # lấy giá trị từ dict
# Cache
from langchain_community.cache import InMemoryCache
from langchain.globals import set_llm_cache