# open bash shell here
# ./local-deploy.sh

ip="194.163.147.10"

rm -rf services/dist
echo 'dist cleaned up'

# go to nestjs directory
cd services
# build nestjs app 
npm run build
echo "backend built"

# go to angular directory
cd ../book-agency
# build angular app 
ng build
echo "front built"
cd ..


cp -r services/.env services/dist
cp -r services/package.json services/dist
echo 'dist preparation finished'


ssh root@$ip "
    rm -rf ../../app/book-agency
    exit
"
echo 'server dist cleaned up'

scp -r services/dist root@$ip:/../../app/book-agency
echo 'dist copy finished'

echo 'installing dependencies...'
ssh root@$ip "
    cd ../../app/book-agency
    npm i
    pm2 start book-agency.js
    exit
"
echo 'READY'


# go 194.163.147.10/8100
# 194.163.147.10/8100/api 