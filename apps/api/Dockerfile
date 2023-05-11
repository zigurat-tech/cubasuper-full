FROM python:3.10

WORKDIR app

#update pip
RUN pip install --upgrade pip

#install requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

#copy proyect files
COPY . .

#start django server
CMD ["python", "manage.py", "runserver","0.0.0.0:8000"]
