from PIL import Image, ImageDraw
import glob, os, sys
fs=sorted(glob.glob('_qa/final/f*.png'))
def sheet(names,out,cols=5,W=270,H=480):
    rows=(len(names)+cols-1)//cols
    S=Image.new('RGB',(cols*W,rows*(H+22)),'white')
    d=ImageDraw.Draw(S)
    for i,n in enumerate(names):
        im=Image.open(n).convert('RGB').resize((W,H))
        x=(i%cols)*W; y=(i//cols)*(H+22)
        S.paste(im,(x,y+22)); d.text((x+4,y+4),os.path.basename(n)+'  t=%.3f'%(int(os.path.basename(n)[1:4])/30),fill='black')
    S.save(out)
sheet(fs[:15],'_qa/final/sheetA.png'); sheet(fs[15:],'_qa/final/sheetB.png')
print(len(fs))
