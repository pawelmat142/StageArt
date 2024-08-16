# open bash shell here
# ./local-deploy.sh

ip="77.237.244.101"

echo 'start deploy'

rm -rf services/dist
echo 'dist cleaned up'

# go to nestjs directory
cd services
# build nestjs app 
npm run build
echo "backend built"

# go to angular directory
cd ../angular
# build angular app 
ng build
echo "front built"
cd ..


cp -r services/.env services/dist
cp -r services/package.json services/dist
cp -r production/.env services/dist
echo 'dist preparation finished'


ssh root@$ip "
    rm -rf ../app/book
    exit
"
echo 'server dist cleaned up'

scp -r services/dist root@$ip:/../app/book
echo 'dist copy finished'

echo 'installing dependencies...'

ssh root@$ip "
    cd ../app/book
    npm i
    npm install @nestjs/core @nestjs/common @nestjs/platform-express
    pm2 start book-agency.js
    exit
"
echo 'READY'


# go 77.237.244.101/8100
# 77.237.244.101/8100/api 