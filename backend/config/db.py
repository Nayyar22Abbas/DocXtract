from pymongo import MongoClient
# from motor.motor_asyncio import AsyncIOMotorClient



MONGO_URI="mongodb+srv://AhsanAli:221849123@mycluster.tgkmqdz.mongodb.net/DOCxTRACT"
conn=MongoClient(MONGO_URI)

authconn=conn.DOCxTRACT.users
pdfconn = conn.DOCxTRACT.pdf_files
quizconn = conn.DOCxTRACT.quizzes


# later motor will be used to support the  async operations

# async_conn=AsyncIOMotorClient(MONGO_URI)  
# authconn=async_conn.DOCxTRACT.users





