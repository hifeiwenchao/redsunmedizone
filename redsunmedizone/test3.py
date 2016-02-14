'''
Created on 2016年2月13日

@author: root
'''
import imaplib
import re




def decode_content(message):
    try:
        content = message.get_payload(decode=True)
        charset = message.get_content_charset('utf-8')
        if charset != 'utf-8':
            return content.decode(charset)
        return content
    except Exception:
        return 'Could not parse content'


list_pattern = re.compile(r'\((?P<flags>.*?)\) "(?P<delimiter>.*)" (?P<name>.*)')

M = imaplib.IMAP4('imap.alibaba.com')
M.login('matt@heershi.com.cn', 'as501180920')
type_,folders = M.list()
for folder in folders:
    print(folder)
    try:
        flags, delimiter, folder_name = list_pattern.match(folder.decode()).groups()
        folder_name = folder_name.strip('"')
        #print(folder_name)
    except BaseException as e:
        print("[-] Parse folder {0} failed: {1}".format(folder, e))
        continue
M.logout()


b'(\\Trash) "/" "&XfJSIJZkkK5O9g-"'
b'(\\Drafts) "/" "&g0l6Pw-"'
b'() "/" "INBOX"'
b'() "/" "info@heershi.com"'
b'() "/" "Jeanne"'
b'() "/" "matt@redsunmedizone.com"'
b'() "/" "RFQ"'
b'(\\Sent) "/" "&XfJT0ZAB-"'
b'(\\Junk) "/" "&V4NXPpCuTvY-"'
b'() "/" "&TgBZJ5Aa-"'
b'() "/" "&Tgd,vU8BThqQrnux-"'
b'() "/" "&UqBi,1kncG+Bwg-Rob"'
b'() "/" "&UxdOrJV,kBpW,ZZFedFigGcJllBRbFP4-"'
b'() "/" "&VAhPXFuiYjc-"'
b'() "/" "&VAhPXFuiYjc-/&UqBi,1kn-Shenoy"'
b'() "/" "&VAhPXFuiYjc-/&U3BcPA-Teddy"'
b'() "/" "&VAhPXFuiYjc-/&U3Bepg-Bharat"'
b'() "/" "&VAhPXFuiYjc-/&U4R03FkaXBQ-Alvaro"'
b'() "/" "&VAhPXFuiYjc-/&VOVPJmvUTpo-David"'
b'() "/" "&VAhPXFuiYjc-/&Vx+AM1F2-Cristian"'
b'() "/" "&VAhPXFuiYjc-/&V8NTyg-Osama"'
b'() "/" "&VAhPXFuiYjc-/&WKiJf1Tl-Ruben"'
b'() "/" "&VAhPXFuiYjc-/&XfRX+mWvV2Y-Rashid"'
b'() "/" "&VAhPXFuiYjc-/&XfSJfw-Renato"'
b'() "/" "&VAhPXFuiYjc-/&YQ9ZJ1Ip-Monica"'
b'() "/" "&VAhPXFuiYjc-/&ZGltG1Tl-Mr.Largab"'
b'() "/" "&VAhPXFuiYjc-/&ZbBSoFdh-Robin"'
b'() "/" "&VAhPXFuiYjc-/&aDycgVQJTpo-Goga"'
b'() "/" "&VAhPXFuiYjc-/&aDycgVQJTpo-Mamuka"'
b'() "/" "&VAhPXFuiYjc-/&bJlyeQ-Dims Ayson"'
b'() "/" "&VAhPXFuiYjc-/&bPBW,Q-pom"'
b'() "/" "&VAhPXFuiYjc-/&b7NZJ1IpTpqae1NwXDxZJ09,mYY-"'
b'() "/" "&VAhPXFuiYjc-/&edFaAXJ5-Aly"'
b'() "/" "&VAhPXFuiYjc-/&f1eabFw8Tpo-Sebastian"'
b'() "/" "&VAhPXFuiYjc-/&f45W,Q-sunnexKim"'
b'() "/" "&VAhPXFuiYjc-/&gvFW,Q-Dr.Jean"'
b'() "/" "&VAhPXFuiYjc-/&g,Jfi1u+-MayStar"'
b'() "/" "&VAhPXFuiYjc-/&hJlT5A-Haley"'
b'() "/" "&VAhPXFuiYjc-/&jYpTVw-Alex"'
b'() "/" "&VAhPXFuiYjc-/&lj9cFFPKUilOmg-Ms.Widad"'
b'() "/" "&VAhPXFuiYjc-/&l+lW,VAqfs90Bg-"'
b'() "/" "&VAhPXFuiYjc-/&mZluLw-Dixon"'
b'() "/" "&VAxOi1uiYjc-"'
b'() "/" "&VAxOi1uiYjc-/&U3BcPA-Reza"'
b'() "/" "&VAxOi1uiYjc-/&XfRX+mWvV2Y-Aqib"'
b'() "/" "&VAxOi1uiYjc-/&f45W,Q-Rudy"'
b'() "/" "&VAxOi1uiYjc-/&l+lW,Q-Lee"'
b'() "/" "&WRZW,U66Z2VTTpCAi,dR,Q-"'
b'() "/" "&W56ajFuki75ZBw-"'
b'() "/" "&YQ9UEVuiYjc-"'
b'() "/" "&YQ9UEVuiYjc-/&Tjmepg-Karina"'
b'() "/" "&YQ9UEVuiYjc-/&W19SoGLJ-ferdowsh"'
b'() "/" "&YQ9UEVuiYjc-/&W19SoGLJ-shafiqul"'
b'() "/" "&YQ9UEVuiYjc-/&YQ9ZJ1Ip-Paride"'
b'() "/" "&YQ9UEVuiYjc-/&bOJRcA-Janusz"'
b'() "/" "&YQ9UEVuiYjc-/&bPBW,Q-Anongnad"'
b'() "/" "&YQ9UEVuiYjc-/&bPBW,Q-Charin"'
b'() "/" "&YQ9UEVuiYjc-/&f1eabFw8Tpo-Iulius"'
b'() "/" "&YQ9UEVuiYjc-/&l+lW,Q-Kim"'
b'() "/" "&YQ9UEVuiYjc-/&l+lW,ZHRUUh1Hw-"'
b'() "/" "&amGA9pHHjS0-"'
b'() "/" "&bPBW,YhM-"'
b'() "/" "&b1xXKFuiYjc-"'
b'() "/" "&b1xXKFuiYjc-/A&V8NTyg-Aly"'
b'() "/" "&b1xXKFuiYjc-/A&V8NTyg-fathy"'
b'() "/" "&b1xXKFuiYjc-/A&V8NYXk,Ea9ROmg-"'
b'() "/" "&b1xXKFuiYjc-/A&lj9cFFPKUilOmg-ADIB"'
b'() "/" "&b1xXKFuiYjc-/A&lj9cFFPKUilOmg-Amina"'
b'() "/" "&b1xXKFuiYjc-/A&lj9cFFPKUilOmg-Mr.Guett"'
b'() "/" "&b1xXKFuiYjc-/A&lj9cFFPKUilOml5zXjiQUw-"'
b'() "/" "&b1xXKFuiYjc-/B&U1qDKHTmfrM-Tracy"'
b'() "/" "&b1xXKFuiYjc-/B&XfRX+mWvV2Y-Rehan"'
b'() "/" "&b1xXKFuiYjc-/B&XfRX+mWvV2Y-Shahid"'
b'() "/" "&b1xXKFuiYjc-/B&XfRX+mWvV2Y-Zafar"'
b'() "/" "&b1xXKFuiYjc-/B&XfRX+mWvV2Y-Zain"'
b'() "/" "&b1xXKFuiYjc-/B&XfSJfw-Abdon"'
b'() "/" "&b1xXKFuiYjc-/B&a9RSKWX2-Hassan"'
b'() "/" "&b1xXKFuiYjc-/B&bOJRcA-Iwona"'
b'() "/" "&b1xXKFuiYjc-/B&bOJRcA-Marta"'
b'() "/" "&b1xXKFuiYjc-/B&c7tSKX70Tpo-Adolfo"'
b'() "/" "&b1xXKFuiYjc-/B&edicgQ-Maria"'
b'() "/" "&b1xXKFuiYjc-/D&Tjmepg-MA Knudsen"'
b'() "/" "&b1xXKFuiYjc-/D&WRpU5Q-Danklou"'
b'() "/" "&b1xXKFuiYjc-/D&WRp8c1w8UqA-"'
b'() "/" "&b1xXKFuiYjc-/D&X7dW,Q-Werner"'
b'() "/" "&b1xXKFuiYjc-/D&j+pi3A-Mohd"'
b'() "/" "&b1xXKFuiYjc-/E&U4R03FkaXBQ-Ivan"'
b'() "/" "&b1xXKFuiYjc-/E&U4R03FkaXBQ-Jhonathan"'
b'() "/" "&b1xXKFuiYjc-/F&g,Jfi1u+-Bedoria"'
b'() "/" "&b1xXKFuiYjc-/F&g,Jfi1u+-Reagan"'
b'() "/" "&b1xXKFuiYjc-/G&VOVPJmvUTpo-Natalia"'
b'() "/" "&b1xXKFuiYjc-/J&UqBi,1kn-Anthony"'
b'() "/" "&b1xXKFuiYjc-/J&UqBi,1kn-Joseph"'
b'() "/" "&b1xXKFuiYjc-/J&UqBi,1kn-Mark"'
b'() "/" "&b1xXKFuiYjc-/J&Y3dRSw-"'
b'() "/" "&b1xXKFuiYjc-/J&Y3dRSw-Ing Jan"'
b'() "/" "&b1xXKFuiYjc-/J&Y3dRS1F9Uzs-"'
b'() "/" "&b1xXKFuiYjc-/L&Uilr1E6a-younis"'
b'() "/" "&b1xXKFuiYjc-/L&f1eabFw8Tpo-Roxana"'
b'() "/" "&b1xXKFuiYjc-/M&WKiJf1Tl-Andrea"'
b'() "/" "&b1xXKFuiYjc-/M&WKiJf1Tl-Carlos"'
b'() "/" "&b1xXKFuiYjc-/M&WKiJf1Tl-Jose"'
b'() "/" "&b1xXKFuiYjc-/M&W19SoGLJ-HM sharif"'
b'() "/" "&b1xXKFuiYjc-/M&W19SoGLJ-Ms.Mukti"'
b'() "/" "&b1xXKFuiYjc-/M&W19SoGLJ-Noor"'
b'() "/" "&b1xXKFuiYjc-/M&W19SoGLJ-SteelCo"'
b'() "/" "&b1xXKFuiYjc-/M&a9uRzFhUXDxOmg-Abdel"'
b'() "/" "&b1xXKFuiYjc-/M&a9uRzGxCZa8-"'
b'() "/" "&b1xXKFuiYjc-/M&f45W,Q-Alexis"'
b'() "/" "&b1xXKFuiYjc-/M&f45W,Q-Eric"'
b'() "/" "&b1xXKFuiYjc-/M&f45W,Q-Javier"'
b'() "/" "&b1xXKFuiYjc-/M&f45W,Q-Michael"'
b'() "/" "&b1xXKFuiYjc-/M&f45W,Q-Susan"'
b'() "/" "&b1xXKFuiYjc-/M&g6toUWvUUUs-Analberto"'
b'() "/" "&b1xXKFuiYjc-/M&hJlT5A-zolboo"'
b'() "/" "&b1xXKFuiYjc-/M&mmxnZYl,Tpo-Mohd"'
b'() "/" "&b1xXKFuiYjc-/M&mmxnZYl,Tpo-Stan"'
b'() "/" "&b1xXKFuiYjc-/M&mmxnZYl,TpqexFmuUXk-"'
b'() "/" "&b1xXKFuiYjc-/M&mmyPvlKgZa9SoA-Rakotom"'
b'() "/" "&b1xXKFuiYjc-/N&U1eXXg-Ms.Mariolize"'
b'() "/" "&b1xXKFuiYjc-/N&XDxl5VIpTpo-Saliu"'
b'() "/" "&b1xXKFuiYjc-/N&XDxzwFwU-Binaya"'
b'() "/" "&b1xXKFuiYjc-/R&ZeVnLA-June"'
b'() "/" "&b1xXKFuiYjc-/R&ZeVnLGWwTpV1MA-"'
b'() "/" "&b1xXKFuiYjc-/R&dF5ReA-Abtin"'
b'() "/" "&b1xXKFuiYjc-/S&WF5cFHTmWRo-Stanley"'
b'() "/" "&b1xXKFuiYjc-/S&WF5tZo3vZa8-Dr.Christian"'
b'() "/" "&b1xXKFuiYjc-/S&Za+RzFFwU2E-"'
b'() "/" "&b1xXKFuiYjc-/S&bJlyeQ-Abin"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-Cagdas"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-H.Cihan"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-Ibrahim"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-Idris"'
b'() "/" "&b1xXKFuiYjc-/T&Vx+AM1F2-Zeki"'
b'() "/" "&b1xXKFuiYjc-/T&bPBW,Q-Arlene"'
b'() "/" "&b1xXKFuiYjc-/T&eoFcPGWv-Karim"'
b'() "/" "&b1xXKFuiYjc-/W&TkxRS1Fw-Dasha"'
b'() "/" "&b1xXKFuiYjc-/W&U3FXMJpsYsk-Fernando"'
b'() "/" "&b1xXKFuiYjc-/W&WRaNOFFsU,g-Kylin"'
b'() "/" "&b1xXKFuiYjc-/W&WdRRhXReYsk-Jose"'
b'() "/" "&b1xXKFuiYjc-/W&WdRRhXReYsk-Renny"'
b'() "/" "&b1xXKFuiYjc-/W&ZYeDsQ-William"'
b'() "/" "&b1xXKFuiYjc-/X&ZbBR4FGFTpo-"'
b'() "/" "&b1xXKFuiYjc-/X&ZbBSoFdh-Kumar"'
b'() "/" "&b1xXKFuiYjc-/X&iX9z7XJZ-Felicidad"'
b'() "/" "&b1xXKFuiYjc-/X&iX9z7XJZi8piQA-Luis"'
b'() "/" "&b1xXKFuiYjc-/X&mZluLw-Joy"'
b'() "/" "&b1xXKFuiYjc-/X&mZluLw-YKLEE"'
b'() "/" "&b1xXKFuiYjc-/Y&Tl+V6A-"'
b'() "/" "&b1xXKFuiYjc-/Y&Tpp,jlw8Tpo-Yervand"'
b'() "/" "&b1xXKFuiYjc-/Y&TuWCclIX-Lidor"'
b'() "/" "&b1xXKFuiYjc-/Y&TwpnFw-Homayoun"'
b'() "/" "&b1xXKFuiYjc-/Y&TwpnFw-Hossein"'
b'() "/" "&b1xXKFuiYjc-/Y&TwpnFw-Reza"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Arief"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Aryo"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Dirjaya"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Lukito"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Prames"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BcPA-Rudi"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-Ashish"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-Hari"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-Krishna"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-Nancy&XyA-"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-peter"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-Peter&UqliSw-wendy"'
b'() "/" "&b1xXKFuiYjc-/Y&U3Bepg-sanjay"'
b'() "/" "&b1xXKFuiYjc-/Y&U3BeplNX-"'
b'() "/" "&b1xXKFuiYjc-/Y&YQ9ZJ1Ip-Albert"'
b'() "/" "&b1xXKFuiYjc-/Y&fqZl5g-Mohammad"'
b'() "/" "&b1xXKFuiYjc-/Y&gvFW,Q-David"'
b'() "/" "&b1xXKFuiYjc-/Y&gvFW,Q-James"'
b'() "/" "&b1xXKFuiYjc-/Y&gvFW,Q-Phillip"'
b'() "/" "&b1xXKFuiYjc-/Y&jYpTVw-Dzung"'
b'() "/" "&b1xXKFuiYjc-/Y&jYpTVw-Mr.Dung"'
b'() "/" "&b1xXKFuiYjc-/Y&jYpTVw-Thu Thao"'
b'() "/" "&b1xXKFuiYjc-/Z&Ti1OHA-bakir"'
b'() "/" "&b1xXKFuiYjc-/Z&Ti1OHA-EMAD"'
b'() "/" "&c690A14CVzo-"'










