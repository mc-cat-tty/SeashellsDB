# SeashellDB
Python source code for managing and visualizing Seashells MariaDB database

## MariaDB package installation notes
```
sudo apt install libmariadb3 libmariadb-dev
pip3 install mariadb
```

## Setting up

### Install dependencies
```
pip3 install requirements.txt
```

### Create database
Run _tools/db_init.sql_ on your database server

### Import raw data
```
python3 importer.py -p _password_
```
Keep in mind that you have to set your own password through `-p` argument, otherwise the script will exit with exit status 1
Change the others parameters if needed

### Add raw data
```
python3 importer.py -f _filename_ -p _password_ --add
```

### Local Jupyter set up 
Extremely handy during code prototyping (eg.: test SQL queries through mariadb connectors, clean raw data, ...)
If Jupyter is already installed (globally): `python3 -m pip install jupyter notebook`
Run inside your virtual environment (must be enabled):
```
python -m pip install ipykernel
ipykernel kernel install --user --name=SeashellsDDB
```
And now globally (virtual environment deactivated):
```
python3 -m notebook
```
From web interface change Kernel from _Kernel_ > _Change Kernel_