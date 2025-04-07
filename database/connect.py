import os
import re
from os.path import join

output = ''
for file in os.listdir("procedures"):
        with open(join("procedures",file),'r',encoding='utf-8') as infile:
            output += infile.read()
            output += '\n'

with open('AllProcedures.sql','w',encoding='utf-8') as outfile:
    outfile.write(output)