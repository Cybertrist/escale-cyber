#!/bin/bash
# Refait toutes les images du README : la bannière, les bandeaux de section,
# les tuiles du sommaire et les schémas. Chaque image est une page HTML
# que Chrome capture en mode headless, à l'échelle 2.
#
#   bash docs/tools/images.sh
#
# CHROME=/chemin/vers/chrome pour changer de navigateur (Chrome ou Edge).
set -e
D="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$(cd "$D/.." && pwd)"
CH="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
TMP="$D/html"
mkdir -p "$TMP" "$OUT/sections" "$OUT/sommaire" "$OUT/schemas"
W_TMP="$(cd "$TMP" && pwd -W 2>/dev/null || pwd)"
W_OUT="$(cd "$OUT" && pwd -W 2>/dev/null || pwd)"

# Palette de la plateforme (src/app/globals.css)
INK="#0e1b2c"; INK2="#16263b"; INK3="#1c3050"; LINE="#2a3f5a"
ON="#eef2f6"; MUTED="#c3cfdd"; DIM="#8ea2ba"; SIGNAL="#f2b33d"
USINE="#1f5fd6"; ATELIER="#6d3fd1"; CENTRALE="#f2b33d"; CHANTIER="#1f8a5a"; TRONC="#7fd3a8"

FONTS='<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">'
BASE="*{margin:0;padding:0;box-sizing:border-box}body{background:$INK;color:$ON;font-family:Figtree,sans-serif;overflow:hidden}"

LOGO='<svg viewBox="0 0 34 34" fill="none" stroke="'$SIGNAL'" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="7" r="3.2"/><path d="M17 10.2V29"/><path d="M10 15h14"/><path d="M5 20c0 5.5 5.4 9 12 9s12-3.5 12-9"/><path d="M3 22l2-2 2 2M27 22l2-2 2 2"/></svg>'

# Icônes (les mêmes tracés que src/components/icons.tsx pour les escales)
ico () {
  local p
  case "$1" in
    tronc)    p='<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>' ;;
    usine)    p='<path d="M3 20V10l5 3V10l5 3V6h3v14z"/><path d="M17 6V3h2v17"/><path d="M2 20h20"/>' ;;
    atelier)  p='<rect x="6" y="8" width="12" height="10" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3.5" r="1"/><circle cx="9.5" cy="12.5" r="1"/><circle cx="14.5" cy="12.5" r="1"/><path d="M3 12v3M21 12v3"/>' ;;
    centrale) p='<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>' ;;
    chantier) p='<path d="M4 21V5h10"/><path d="M4 5h10l6 4"/><path d="M14 5v4"/><path d="M17 9v5"/><rect x="15" y="14" width="4" height="3"/><path d="M2 21h20"/>' ;;
    ancre)    p='<circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V21"/><path d="M8 11h8"/><path d="M4 14c0 4 3.6 7 8 7s8-3 8-7"/>' ;;
    etoile)   p='<path d="M12 3l1.8 4.9L19 9.7l-4.2 3 1.5 5.3L12 15l-4.3 3 1.5-5.3L5 9.7l5.2-1.8z"/>' ;;
    terminal) p='<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M12 15h5"/>' ;;
    compte)   p='<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>' ;;
    archi)    p='<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="8.5" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v2h11v-2M12 12v2"/>' ;;
    dossier)  p='<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>' ;;
    plume)    p='<path d="M20 4c-6 0-11 4-12.5 10.5L6 20"/><path d="M20 4c0 6-4 10.5-10.5 12"/><path d="M9 11h6"/>' ;;
    reglage)  p='<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>' ;;
    route)    p='<path d="M5 20c0-4 3-5 7-5s7-1 7-5-3-5-7-5"/><circle cx="5" cy="20" r="1.6"/><circle cx="12" cy="5" r="1.6"/>' ;;
  esac
  echo "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"${2:-currentColor}\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\">$p</svg>"
}

# shot <nom html> <sortie relative à docs/> <largeur> <hauteur>
shot () {
  "$CH" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=10000 \
    --force-device-scale-factor=2 --window-size="$3,$4" \
    --screenshot="$W_OUT/$2" "file:///$W_TMP/$1" >/dev/null 2>&1
  echo "  $2"
}

# ------------------------------------------------------------------ bannière
cat > "$TMP/banniere.html" <<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8">$FONTS<style>$BASE
.w{width:1280px;height:320px;position:relative;
   background:radial-gradient(900px 420px at 12% 40%,$INK3 0%,transparent 60%),
              radial-gradient(700px 400px at 100% 100%,#1a2a44 0%,transparent 70%),$INK}
.logo{position:absolute;left:68px;top:88px;width:142px;height:142px;border-radius:30px;
      background:linear-gradient(160deg,$INK3,$INK2);border:1.5px solid $LINE;
      box-shadow:0 0 60px rgba(242,179,61,.18);display:flex;align-items:center;justify-content:center}
.logo svg{width:84px;height:84px}
.txt{position:absolute;left:262px;top:72px}
h1{font-family:'Bricolage Grotesque';font-weight:800;font-size:74px;letter-spacing:-2px;line-height:1}
h1 b{color:$SIGNAL;font-weight:800}
p{margin-top:16px;font-size:23px;line-height:1.45;color:$MUTED;max-width:720px}
.chips{display:flex;gap:9px;margin-top:22px}
.chips span,.tags span{font-family:'JetBrains Mono';font-size:12.5px;font-weight:500;letter-spacing:1px;
   color:$SIGNAL;border:1px solid #3a4a60;background:rgba(22,38,59,.8);border-radius:6px;padding:7px 11px;text-transform:uppercase}
.tags{position:absolute;right:48px;top:28px;display:flex;gap:8px}
.tags span{color:$DIM;letter-spacing:3px}
.esc{position:absolute;right:56px;top:110px;display:grid;grid-template-columns:repeat(2,58px);gap:12px}
.esc i{width:58px;height:58px;border-radius:14px;display:flex;align-items:center;justify-content:center;border:1px solid $LINE;background:$INK2}
.esc i svg{width:28px;height:28px}
.bar{position:absolute;left:0;right:0;bottom:0;height:4px;display:flex}
.bar i{flex:1}
</style></head><body><div class="w">
<div class="tags"><span>Web</span><span>Formation</span><span>Cyberdéfense 5A</span></div>
<div class="logo">$LOGO</div>
<div class="txt">
  <h1>Escale <b>Cyber</b></h1>
  <p>La cybersécurité, escale par escale, pour les quatre spécialités lorientaises de l'ENSIBS.</p>
  <div class="chips"><span>Next.js 16</span><span>PocketBase</span><span>MDX</span><span>11 modules</span><span>1 lab</span></div>
</div>
<div class="esc">
  <i>$(ico usine $USINE)</i><i>$(ico atelier "#9d7ae8")</i>
  <i>$(ico centrale $CENTRALE)</i><i>$(ico chantier "#3fbf85")</i>
</div>
<div class="bar"><i style="background:$USINE"></i><i style="background:$ATELIER"></i><i style="background:$CENTRALE"></i><i style="background:$CHANTIER"></i></div>
</div></body></html>
HTML
shot banniere.html banniere.png 1280 320

# ------------------------------------------------------- bandeaux de section
SECTIONS=("Sommaire" "Le projet" "Fonctionnalités" "Démarrer" "Comptes de démo" "Architecture" "Structure du projet" "Écrire un module" "Configuration" "Feuille de route")
for i in "${!SECTIONS[@]}"; do
  ix=$(printf '%02d' "$i")
  cat > "$TMP/s$ix.html" <<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8">$FONTS<style>$BASE
.w{width:1280px;height:118px;display:flex;flex-direction:column;justify-content:center;gap:18px;padding:0 60px}
.row{display:flex;align-items:center;gap:20px;height:40px}
.ix{width:52px;height:40px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono';
    font-size:15px;font-weight:500;letter-spacing:1px;color:$SIGNAL;border:1.5px solid #4a4230;background:#1f2528;border-radius:6px}
h2{font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;letter-spacing:4px;text-transform:uppercase;white-space:nowrap}
.rule{height:2px;display:flex;border-radius:2px;overflow:hidden}
.rule .a{width:52px;background:$SIGNAL}
.rule .b{flex:1;background:linear-gradient(90deg,#3a506b 0%,#22324a 42%,transparent 100%)}
</style></head><body><div class="w">
<div class="row"><div class="ix">$ix</div><h2>${SECTIONS[$i]}</h2></div>
<div class="rule"><i class="a"></i><i class="b"></i></div>
</div></body></html>
HTML
  shot "s$ix.html" "sections/s$ix.png" 1280 118
done

# ------------------------------------------------------- tuiles du sommaire
ICONES=("" ancre etoile terminal compte archi dossier plume reglage route)
for i in $(seq 1 9); do
  ix=$(printf '%02d' "$i")
  cat > "$TMP/t$ix.html" <<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8">$FONTS<style>$BASE
body{background:transparent}
.w{width:250px;height:64px;border-radius:12px;background:linear-gradient(90deg,$INK2,#132236);border:1px solid #243752;
   display:flex;align-items:center;gap:14px;padding:0 14px}
.i{width:40px;height:40px;border-radius:10px;background:#1b2d47;border:1px solid #2c4262;display:flex;align-items:center;justify-content:center}
.i svg{width:21px;height:21px}
small{display:block;font-family:'JetBrains Mono';font-size:11px;color:$SIGNAL;letter-spacing:1px}
b{display:block;font-family:'Bricolage Grotesque';font-weight:700;font-size:16.5px;color:$ON;margin-top:1px;white-space:nowrap}
</style></head><body><div class="w">
<div class="i">$(ico "${ICONES[$i]}" "$SIGNAL")</div>
<div><small>$ix</small><b>${SECTIONS[$i]}</b></div>
</div></body></html>
HTML
  shot "t$ix.html" "sommaire/$ix.png" 250 64
done

# ------------------------------------------------------- schéma des escales
carte () { # carte <icone> <couleur> <numéro> <nom> <spécialité> <modules>
  cat <<C
<div class="c" style="--c:$2"><div class="h"><i>$(ico "$1" "$2")</i><small>$3</small></div>
<b>$4</b><em>$5</em><ul>$6</ul></div>
C
}
cat > "$TMP/escales.html" <<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8">$FONTS<style>$BASE
.w{width:1280px;height:470px;padding:44px 56px}
.cards{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.c{background:$INK2;border:1px solid $LINE;border-top:3px solid var(--c);border-radius:14px;padding:18px 16px;height:268px}
.h{display:flex;justify-content:space-between;align-items:center}
.h i{width:40px;height:40px;border-radius:10px;background:#0f1d30;display:flex;align-items:center;justify-content:center}
.h i svg{width:22px;height:22px}
.h small{font-family:'JetBrains Mono';font-size:12px;color:$DIM}
.c b{display:block;margin-top:16px;font-family:'Bricolage Grotesque';font-weight:800;font-size:21px;letter-spacing:-.3px}
.c em{display:block;font-style:normal;font-size:13.5px;color:var(--c);margin-top:3px;font-weight:600}
.c ul{list-style:none;margin-top:16px;display:flex;flex-direction:column;gap:7px}
.c li{font-size:13.5px;color:$MUTED;line-height:1.3;padding-left:12px;position:relative}
.c li:before{content:"";position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:var(--c)}
.c li.lab{color:$SIGNAL}
.steps{margin-top:30px;display:flex;align-items:center;gap:12px}
.steps .t{font-family:'JetBrains Mono';font-size:12px;color:$DIM;letter-spacing:2px;text-transform:uppercase;margin-right:8px}
.s{display:flex;align-items:center;gap:10px;background:$INK2;border:1px solid $LINE;border-radius:999px;padding:9px 18px 9px 9px}
.s span{width:28px;height:28px;border-radius:50%;background:$SIGNAL;color:$INK;font-family:'JetBrains Mono';font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
.s b{font-family:'Bricolage Grotesque';font-weight:700;font-size:16px}
.arr{color:$LINE;font-size:20px}
.note{margin-top:22px;font-size:14px;color:$DIM}
</style></head><body><div class="w">
<div class="cards">
$(carte tronc $TRONC 00 "Tronc commun" "Toutes spécialités" "<li>Mots de passe</li><li>Phishing</li><li>Mises à jour</li>")
$(carte usine "#5b8ef0" 01 "L'usine" "Génie Industriel" "<li>La commande fournisseur piégée</li><li>La clé USB du parking</li>")
$(carte atelier "#9d7ae8" 02 "L'atelier robotique" "Mécatronique" "<li>Le firmware du robot</li><li>Le robot qui bouge tout seul</li>")
$(carte centrale $CENTRALE 03 "La centrale" "Génie Énergétique" "<li>La supervision exposée</li><li>Le faux technicien</li><li class=lab>Lab : l'automate au mot de passe d'usine</li>")
$(carte chantier "#3fbf85" 04 "Le chantier connecté" "Génie Civil" "<li>La maquette BIM partagée</li><li>Le faux maître d'ouvrage</li>")
</div>
<div class="steps"><span class="t">Chaque module</span>
<div class="s"><span>1</span><b>Contexte</b></div><span class="arr">→</span>
<div class="s"><span>2</span><b>Simulation</b></div><span class="arr">→</span>
<div class="s"><span>3</span><b>Quiz</b></div><span class="arr">→</span>
<div class="s"><span>4</span><b>Fiche réflexe</b></div></div>
<p class="note">Onze modules d'exemple, écrits en MDX dans content/modules. Chaque équipe de spécialité complète son escale.</p>
</div></body></html>
HTML
shot escales.html schemas/escales.png 1280 470

# ---------------------------------------------------- schéma d'architecture
cat > "$TMP/architecture.html" <<HTML
<!doctype html><html lang="fr"><head><meta charset="utf-8">$FONTS<style>$BASE
.w{width:1280px;height:540px;position:relative}
.b{position:absolute;background:$INK2;border:1px solid $LINE;border-radius:14px;padding:16px 18px}
.b small{font-family:'JetBrains Mono';font-size:11.5px;color:$DIM;letter-spacing:2px;text-transform:uppercase}
.b b{display:block;font-family:'Bricolage Grotesque';font-weight:800;font-size:21px;margin-top:6px}
.b p{font-size:13.5px;color:$MUTED;margin-top:6px;line-height:1.4}
.hl{border-color:$SIGNAL;box-shadow:0 0 40px rgba(242,179,61,.12)}
.soon{border-style:dashed;border-color:#3a506b;background:transparent}
.soon b{color:$MUTED}
.tag{display:inline-block;margin-top:8px;font-family:'JetBrains Mono';font-size:11px;color:$SIGNAL;border:1px solid #4a4230;border-radius:5px;padding:3px 7px}
.soon .tag{color:$DIM;border-color:#3a506b}
svg.l{position:absolute;inset:0}
.lbl{position:absolute;font-family:'JetBrains Mono';font-size:11.5px;color:$DIM;background:$INK;padding:2px 6px}
</style></head><body><div class="w">
<svg class="l" width="1280" height="540" fill="none" stroke="#3a506b" stroke-width="1.6">
  <path d="M250 150H410" marker-end="url(#a)"/>
  <path d="M700 150H860" marker-end="url(#a)"/>
  <path d="M860 170H700" marker-end="url(#a)" stroke="#3a506b"/>
  <path d="M555 250V330" stroke-dasharray="6 6" marker-end="url(#a)"/>
  <path d="M700 420H860" stroke-dasharray="6 6" marker-end="url(#a)"/>
  <path d="M190 330C190 285 440 290 470 250" marker-end="url(#a)"/>
  <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10z" fill="#3a506b" stroke="none"/></marker></defs>
</svg>
<div class="b" style="left:40px;top:80px;width:210px"><small>Navigateur</small><b>Apprenants et encadrants</b><p>Modules, labs, progression, classement, tableau de bord.</p></div>
<div class="b hl" style="left:410px;top:65px;width:290px"><small>Site</small><b>Next.js 16</b><p>App Router, TypeScript. Lecteur de module, composants pédagogiques, IHM simulée du lab.</p><span class="tag">localhost:3000</span></div>
<div class="b hl" style="left:860px;top:65px;width:380px"><small>API</small><b>PocketBase 0.40</b><p>Comptes et authentification, progression, points, badges. Base SQLite et interface d'administration.</p><span class="tag">127.0.0.1:8090</span></div>
<div class="lbl" style="left:300px;top:126px">HTTPS</div>
<div class="lbl" style="left:730px;top:118px">SDK pocketbase</div>
<div class="b" style="left:40px;top:330px;width:300px"><small>Contenus</small><b>MDX versionnés dans Git</b><p>content/modules/&lt;escale&gt;/*.mdx, écrits par les équipes de spécialité, lus par next-mdx-remote.</p></div>
<div class="b soon" style="left:410px;top:330px;width:290px"><small>Plus tard</small><b>Apache Guacamole</b><p>Bureau distant dans le navigateur, activé par NEXT_PUBLIC_GUACAMOLE_URL.</p><span class="tag">prévu</span></div>
<div class="b soon" style="left:860px;top:330px;width:380px"><small>Plus tard</small><b>Zone lab isolée</b><p>Machines jetables sur Proxmox ou Docker, sans accès au réseau de l'école.</p><span class="tag">prévu</span></div>
<div class="lbl" style="left:730px;top:398px">RDP · VNC · SSH</div>
<div class="lbl" style="left:570px;top:280px">iframe</div>
<div class="lbl" style="left:230px;top:276px">lus par le serveur</div>
</div></body></html>
HTML
shot architecture.html schemas/architecture.png 1280 540

rm -rf "$TMP"
echo "Images refaites dans docs/."
