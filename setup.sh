cd matcha
npm install
ln -s ~/media media
npm start 2> /tmp/matchaError & 
cd ../matcha-front
npm install
npm start
