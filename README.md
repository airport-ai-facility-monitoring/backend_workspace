# 

## Model
www.msaez.io/#/106224189/storming/c39ec80b76052cc5522d38f57cbac60d

## Before Running Services
### Make sure there is a Kafka server running
```
cd kafka
docker-compose up
```
- Check the Kafka messages:
```
cd infra
docker-compose exec -it kafka /bin/bash
cd /bin
./kafka-console-consumer --bootstrap-server localhost:9092 --topic
```

## Run the backend micro-services
See the README.md files inside the each microservices directory:

- member
- notification
- alert
- runwayobject
- runwaycrack
- equipment analysis
- equipmentdashboard


## Run API Gateway (Spring Gateway)
```
cd gateway
mvn spring-boot:run
```

## Test by API
- member
```
 http :8088/users id="id"password="password"employeeId="employeeId"status="status"
 http :8088/employees employeeId="employeeId"name="name"department="department"position="position"hireDate="hireDate"phoneNumber="phoneNumber"email="email"
```
- notification
```
 http :8088/notifications notificationsId="notificationsId"title="title"writerId="writerId"contents="contents"writeDate="writeDate"
```
- alert
```
 http :8088/alerts alertId="alertId"alertLog="alertLog"alertDate="alertDate"
 http :8088/cctvs cctvId="cctvId"cctvUrl="cctvURL"cctvArea="cctvArea"
```
- runwayobject
```
 http :8088/strangeObjects objId="ObjId"objectType="ObjectType"imageUrl="imageURL"cctvId="cctvId"
 http :8088/workers workerId="workerId"workArea="workArea"approvalWorkerCount="approvalWorkerCount"workStartTime="workStartTime"workEndTime="workEndTime"
 http :8088/workTrucks workTruckId="workTruckId"workTruckType="workTruckType"workStartTime="workStartTime"workEndTime="workEndTime"
```
- runwaycrack
```
 http :8088/runwayCracks rcId="rcId"imageUrl="imageURL"cctvId="cctvId"size="size"
 http :8088/runwayCrackReports rcReportid="rcReportid"title="title"repairPeriod="repairPeriod"repairCost="repairCost"cause="cause"reportContents="reportContents"
```
- equipment analysis
```
 http :8088/equipmentReports equipReportid="equipReportid"title="title"maintenanceCost=" maintenanceCost"reportContents="reportContents"equipmentId="equipmentId"state="state"
```
- equipmentdashboard
```
 http :8088/equipment equipmentId=" equipmentId"equipmentType=" equipmentType"equipmentName=" equipmentName"state="state"
```


## Run the frontend
```
cd frontend
npm i
npm run serve
```

## Test by UI
Open a browser to localhost:8088

## Required Utilities

- httpie (alternative for curl / POSTMAN) and network utils
```
sudo apt-get update
sudo apt-get install net-tools
sudo apt install iputils-ping
pip install httpie
```

- kubernetes utilities (kubectl)
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

- aws cli (aws)
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

- eksctl 
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```
