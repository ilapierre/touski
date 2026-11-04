FROM python:3.14

WORKDIR /app

RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "main.py"]