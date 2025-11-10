import pymysql
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv('../.env.local')

# connect to database
connection = pymysql.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

# load csv
csv_file_path = './attraction.csv' 
df = pd.read_csv(csv_file_path)

df[['Latitude', 'Longitude']] = df['Location'].str.split(',', expand=True)
df['Latitude'] = df['Latitude'].astype(float)
df['Longitude'] = df['Longitude'].astype(float)

try:
    with connection.cursor() as cursor:
        # careate table
        sql = """
        CREATE TABLE IF NOT EXISTS attraction (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            introduction TEXT,
            picture VARCHAR(255),
            coordinates POINT NOT NULL,
            SPATIAL INDEX(coordinates)
        );
        """
        cursor.execute(sql)
        connection.commit()

        # insert data
        insert_sql = """
        INSERT INTO attraction (name, introduction, picture, coordinates) 
        VALUES (%s, %s, %s, ST_GeomFromText('POINT(%s %s)'))
        """
        for index, row in df.iterrows():
            cursor.execute(insert_sql, (
                row['Name'], 
                row['Introduction'], 
                row['Picture'], 
                row['Longitude'], 
                row['Latitude']
            ))
        connection.commit()

finally:
    connection.close()

print("Data processed successfully")
