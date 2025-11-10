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
csv_file_path = './toilet.csv' 
df = pd.read_csv(csv_file_path, encoding='utf-8')

boolean_columns = ['Parking', 'ParkingAccessible', 'AdultChange', 'ChangingPlaces',
                   'BabyChange', 'BabyCareRoom', 'DumpPoint', 'DPWashout', 'DPAfterHours', 'Male', 'Female', 'Unisex', 
                   'AllGender', 'Ambulant', 'Accessible', 'Shower']
for col in boolean_columns:
    df[col] = df[col].replace({'TRUE': True, 'FALSE': False})


nan_in_columns = df.isna().sum()
print("NaN in column:")
print(nan_in_columns)

df = df.where(pd.notna(df), None)

try:
    with connection.cursor() as cursor:
        # sql = """
        # CREATE TABLE IF NOT EXISTS toilet (
        #     id INT AUTO_INCREMENT PRIMARY KEY,
        #     coordinates POINT NOT NULL,
        #     name VARCHAR(255),
        #     type VARCHAR(255),
        #     address VARCHAR(255),
        #     town VARCHAR(255),
        #     address_note VARCHAR(255),
        #     parking BOOLEAN,
        #     parking_accessible BOOLEAN,
        #     adult_change BOOLEAN,
        #     changing_places BOOLEAN,
        #     baby_change BOOLEAN,
        #     baby_care_room BOOLEAN,
        #     dump_point BOOLEAN,
        #     dp_washout BOOLEAN,
        #     dp_after_hours BOOLEAN,
        #     dump_point_note VARCHAR(255),
        #     opening_hours VARCHAR(255),
        #     opening_hours_note VARCHAR(255),
        #     male BOOLEAN,
        #     female BOOLEAN,
        #     unisex BOOLEAN,
        #     all_gender BOOLEAN,
        #     ambulant BOOLEAN,
        #     toilet_accessible BOOLEAN,
        #     toilet_note VARCHAR(255),
        #     shower BOOLEAN,
        #     SPATIAL INDEX(coordinates),
        # );
        # """
        # cursor.execute(sql)
        # connection.commit()

        # insert data
        insert_sql = """
        INSERT INTO toilet (
            coordinates, name, type, address, town, address_note, parking, parking_accessible, adult_change, changing_places,
            baby_change, baby_care_room, dump_point, dp_washout, dp_after_hours, dump_point_note,
            opening_hours, opening_hours_note, male, female, unisex, all_gender, ambulant,
            toilet_accessible, toilet_note, shower
        ) VALUES (
            ST_GeomFromText('POINT(%s %s)'), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        """

        for index, row in df.iterrows():
            cursor.execute(insert_sql, (
                row['Longitude'], row['Latitude'], row['Name'],
                row['Type'], row['Address'], row['Town'], row['AddressNote'],
                row['Parking'], row['ParkingAccessible'], row['AdultChange'], row['ChangingPlaces'],
                row['BabyChange'], row['BabyCareRoom'], row['DumpPoint'],
                row['DPWashout'], row['DPAfterHours'], row['DumpPointNote'],
                row['OpeningHours'], row['OpeningHoursNote'], row['Male'],
                row['Female'], row['Unisex'], row['AllGender'], row['Ambulant'],
                row['Accessible'], row['ToiletNote'], row['Shower']
            ))

        connection.commit()
finally:
    connection.close()

print("Data processed successfully")
