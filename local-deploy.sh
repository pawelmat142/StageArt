# open bash shell here
# ./local-deploy.sh

rm -rf dist
echo 'dist cleaned up'

# go to nestjs directory
cd backend
# build nestjs app 
npm run build
echo "backend built"

cp -r .env dist
cp -r package.json dist
cp -r package-lock.json dist

cd dist
npm install --production


# go to angular directory
cd ../../frontend
# build angular app 
ng build
echo "front built"
