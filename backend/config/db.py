from pymongo import MongoClient
# from motor.motor_asyncio import AsyncIOMotorClient



MONGO_URI="mongodb+srv://AhsanAli:221849123@mycluster.tgkmqdz.mongodb.net/DOCxTRACT"

print(MONGO_URI)
conn=MongoClient(MONGO_URI)

authconn=conn.DOCxTRACT.users
