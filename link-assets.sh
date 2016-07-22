# Font Awesome font files
cd src
if [ ! -e "fonts" ]; then
  ln -s ../node_modules/font-awesome/fonts
fi
