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
csv_file_path = './fountains.csv' 
df = pd.read_csv(csv_file_path)

df['Dog_bowl'] = df['Dog_bowl'].replace({'FALSE': False, 'TRUE': True})
df['Bottle_refill_tap'] = df['Bottle_refill_tap'].replace({'FALSE': False, 'TRUE': True})

try:
    with connection.cursor() as cursor:
        sql = """
        CREATE TABLE IF NOT EXISTS fountain (
            id INT AUTO_INCREMENT PRIMARY KEY,
            coordinates POINT NOT NULL,
            dog_bowl BOOLEAN,
            bottle_refill_tap BOOLEAN,
            SPATIAL INDEX(coordinates)
        );
        """
        cursor.execute(sql)
        connection.commit()

        # insert data
        insert_sql = "INSERT INTO fountain (coordinates, dog_bowl, bottle_refill_tap) VALUES (ST_GeomFromText('POINT(%s %s)'), %s, %s)"
        for index, row in df.iterrows():
            cursor.execute(insert_sql, (row['Longitude'], row['Latitude'], row['Dog_bowl'], row['Bottle_refill_tap']))
        connection.commit()
finally:
    connection.close()

print("Data processed successfully")
