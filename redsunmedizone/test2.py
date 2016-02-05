'''
Created on 2016年2月5日

@author: root
'''
import MySQLdb
 
conn=MySQLdb.connect(host='localhost',user='root',passwd='a1s2d3f4',db='crm',port=3306)
cur=conn.cursor()




cur.execute('select * from nation')
nations = cur.fetchall()
for item in nations:
    print(item[0],item[1])
    if item[0] == 35:continue
    cur.execute("update customer set nation = '%s' where nation = '%s' " % (item[0],item[1]))

conn.commit()
cur.close()
conn.close()
