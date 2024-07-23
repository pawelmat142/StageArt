# open bash shell here
# ./local-deploy.sh

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
echo "package.json, .env moved"

cd services/dist
echo 'installing dependencies...'
npm i
echo 'dependencies installed'

node book-agency.js

# go localhost/8100
# localhost/8100/api 