# To-Docker 
### Problems (Why Did We Need Docker?): 

- Deploy your app (testing, production server):  Differences in OS, dependencies, libraries, environments = code breaks in production.   
-  Complicated Setup: (installation errors, versions downgrade) which could take hours or days
-  Conflicting Dependencies: if different apps on the same machine need different versions of a library like Node.js, these versions can conflict and break.
-  Heavy Viryual machine:  before docker, people used vm to isolate invironemnts but vm is big and resourse-heavy




### What is Docker
Docker is a tool or tecknology (open-source platform) used to packages your code + all its dependencies (like OS, libraries, tools) into a container and run this container anywhere: your laptop, a server, or the cloud, used to create a container


### steps: 
1- write the docker file:                                    
2- build to create a docker image                                 
3- run thie container                                

`Dockerfile:` defines everything needed to set up your app inside a Docker container                           
`Dockerimage:` The template (class) we use to create containers(objects)
Think of it like a snapshot of an environment: OS + your app + all tools/dependencies

to look to the dockerfile and build the image which starts the new container: ` docker build -t my-app .`           
to creates and runs a container :` docker run --name my-app-container -d -p 4000:4000 my-app`              
to list all running conatainer:` docker ps `                                 
to remove the docker container:` docker rm c -f  `                                      
to stop a running container: `docker stop  my-app-container`   
to satrt it again: `docker start my-app-container`       
to do somwthing on the running container: `docker exec -it my-app-container (something(bash)) `               
to see the logs of the app in the container: `docker logs my-app-container  `                                  
to get information about the conrainer: `docker inspect my-app-container`                                 
This clears all build cache data: `docker builder prune`            
### You only need to rebuild if:
- You changed the Dockerfile
- You changed your app code (e.g., edited a .js, .py, etc.)
- You deleted the image (not just the container)


### if i want to change in the app code without needing to rebuild and rerun (make your code async with the container code), 

`Hot reload` ` docker run --name my-app-container -v C:\Users\Lenovo\Documents\to-docker\node-app:/app -d -p 4000:4000 my-app`


#### but it has many problems :                  
### when you make your development folder async with the container:
1. it overwrites the node_modules in the container which has some configration specific to windows like esbuild (that are OS-specific) make conflict with linux (docker container run on linux )
2. also make any change in the container affects your development folder (two way binding)
3. if you deleted any folder it will affect the container like node_modules and cant see the packages 

### solution: 
1. Mount the volume as read-only so the container can read from your development folder but can’t modify it (i.e., one-way binding).
2. For folders like node_modules—which should be managed only by the container—you can use anonymous volumes to isolate them from any change in the dev code 

` docker run --name my-app-container -v C:\Users\Lenovo\Documents\to-docker\node-app:/app:ro -v /app/node_modules -d -p 4000:4000 my-app`                                      
` docker run --name my-app-container -v ${pwd}:/app:ro -v /app/node_modules -d -p 4000:4000 my-app `  


to just make the container async with the src folder , now no need to anonymous volume, the node_modeules is isolated 
`docker run --name my-app-container -v "$(Get-Location)/src:/app/src:ro" -d -p 4000:4000 my-app
`                                                                     
to add env variables                                           
`docker run --name my-app-container -v "$(Get-Location)/src:/app/src:ro" --env-file ./.env -d -p 4000:4000 my-app`
                                                                
to list vloumes: `docker volume ls` and remove volume `docker volume rm volume-name`  and delete unused volumes `docker volume prune`


A `volume `is a special storage space managed by Docker.
It lives outside the container’s filesystem, so data survives when the container is stopped, restarted, or deleted.

## Docker-compose: 
- utility with docker not built-in docker, used to make the build and run commands easier
- tool (not part of core Docker engine) that allows you to define and run multi-container Docker applications using a simple YAML file
- you make docker-compose.yml file and when you run `docker-compose up -d` it builds the image and runs the container , `docker-compose down` it stops and remove the container 
- if there is many enviroments, you should create: `docker-compose.yml`,  `docker-compose.dev.yml`, `docker-compose.prod.yml` and to run it ` docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`


 Always rebuild after adding new packages
`docker-compose up --build`


### after running the database inside acontainer if you wite `npm run dev`  it will not work because the database is installed inside the container not your local machine


### in the production mode, any change requires build new image becuse the hot reload in the dev only
___

### for deolyment:                                         
1- create server                                                             
2- connect to the server                                          
3- install docker on the server                                       
4- from the server, clone the repo                                      
5 build the image and run the container                                         

`but it is not a good choice to build the image in the server so you should `                                                      

1- push the code to the repo                                                                      
2- connect to docker (docker login)                                                                           
3- build the image in your machine  docker-compose -f docker-compose.yml -f docker-compose.prod.yml build                             
4- then push the image into your repositry on dockerHub  docker-compose -f docker-compose.yml -f docker-compose.prod.yml push (serviceName)                                            
5- from the server, pull the repo from github (git bull) and pull the image from dockerHub (docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull)                                                              
6- stop the old containers(if exists)run the container                                            

____ 

### If i want load balancer 

i should make and run multiples inctances (containers) from node-app service and use `Nginx` as a load balancer to distribute the requests: 


1- in the up command: docker-compose -f docker-compose.yml -f docker-compose.prod.yml -d up --scale node-app=3   but you should not give the service container_name field because it will lead to duplication errors

2- in case of load balancing we dont need to expose the ports of my app 4000:4000
beacuse the request comes firsr to nginx on 80:80 and it forwards the request to the app container on port 4000 automatically so, now port 4000 already in use so it cant make another instance on the same port because it will lead to  errors





to automate the process rather than each time i push the image to docker hub i should go to the server and pull the image or the repo and run the container we will do this automatically by `watchtower` tool. it is a docker container reasponsible for watching the othe rcontainers and if any container its image changed, watchtower pulls the new image and rerun the container automatically, write this comnand on the server terminal   : docker run -d \
--name watchtower \
-e WATCHTOWER_POLL_INTERVAL=30 -e WATCHTOWER_TRACE=true \ 
-v /var/run/docker.sock:/var/run/docker.sock \
containrrr/watchtower node-app-container 




### Docker orchestration: 
management layer to manage docker and give us special features                                                     

1- `depoly`: it creates the server and connects to it and run the containers from the compose file instead of us                          
2- `scaling`: it creates new server with given container under specific conditions(high load - cpu usage) rahter thean we create new server and run the container in it                                                                            
3- `networking`: the communication is automatically between any container with another one in the same server or anothe server in case of scaling and by default there is a load balancer to distribute the requests                                          
4- `error handling`: if a container is failed, the docker orchestration automatically resyart the conatiner and if there is a scale it creates another one to ensure the scale is done                                                                                                                            
5- `updating`: in case we have an update and we want to send this update to the server , rather than we stop the containers and pull the image and run the containers not efficient because any requests in this time the serer will be failed, with  docker orchestration it automatically create another container or if we have multiple inctances it stopes one and keep the others to serve the requests a pull the image and run the new container  (Rolling update)




__
### Docker swarm: 
Docker orckestration layer                                                


`nodes`: basic unit of Docker swarm which we use to run the containers inside it 
`manager nodes`: the brain of Docker swarm which make the decisions of the options we talked about above 
`worker nodes`: contain the containers 

we go to define stack (it like a docker compose file) we define the services we want to make it run in a worker node 


on the server terminal: docker swarm init : to initialize swarm with one mnager node 





docker service --help to use swarm services 

instead of the commands we can write the functionality of docker swarm inside the docker compose file 