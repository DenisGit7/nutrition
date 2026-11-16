/* Nutrition — installable web app with Supabase sync (or device-only demo mode). */
const SUPABASE_ESM = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm";
const CFG = window.APP_CONFIG || {};
const CLOUD = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);

/* =================== i18n =================== */
const T = {
en:{app:"Nutrition",products:"Products",myProducts:"My products",commonFoods:"Common foods",onlineRes:"Open Food Facts",searchProducts:"Search products…",
searchOnline:"Search online",noProducts:"No saved products yet. Add one with a photo, search online, or use the common foods below.",
addProduct:"Add product",editProduct:"Edit product",fromPhoto:"Fill from photo (AI)",fromPhotoHint:"Photo of the package front and/or the nutrition label",
brand:"Brand",barcode:"Barcode",lookup:"Look up",unit:"Unit",per100:"Per 100",servingSize:"Serving size",servingName:"Serving name",
sugar:"Sugar",fiber:"Fiber",saveToMine:"Save to my products",savedToMine:"Saved to my products",notFound:"Nothing found",
searching:"Searching…",reading:"Reading the photo…",estimated:"Values are estimated — check the label",needPhoto:"Add a photo first",
needOnline:"Online search needs the synced version",offNote:"Data from Open Food Facts (community database) — check values",
translateTo:"Translate to English",translating:"Translating…",translated:"Translated",amountHint:"e.g. 150 g, 2, 1 cup",
autoCalc:"calculated",video:"Add video (screen recording)",videoHint:"Record your screen while the reel plays, then add the recording here",
preparingVideo:"Preparing video…",videoReady:"Video ready",videoNoAudio:"no sound found — using pictures only",videoFail:"Couldn't read this video — try screenshots",
grams:"g",askAI:"Ask AI for a recipe",askSub:"e.g. \u201chow to cook brown lentils\u201d \u2014 get a few options to choose from",askPlaceholder:"What would you like to cook?",
askGo:"Get recipes",askVariants:"Options",askThinking:"Thinking of recipes… (10–30 seconds)",addRecipe:"Add",added2:"Added ✓",editFirst:"Edit first",
showMore:"Ingredients & steps",askEx1:"How to cook brown lentils",askEx2:"High-protein breakfast",askEx3:"Quick dinner with chicken breast",askEx4:"Healthy snack under 200 kcal",perServ:"per serving",needDbUpdate:"Product saved without picture — run 003_product_images.sql in Supabase to enable pictures",findPicture:"Find picture online",choosePicture:"Choose a picture",noPictures:"No pictures found — try a shorter name, or take a photo",picSources:"Photos: Open Food Facts, Wikipedia",picture:"Picture",addPicture:"Add picture",changePicture:"Change",removePicture:"Remove",uploading:"Saving picture…",picFail:"Couldn't save the picture: ",commonHint:"{n} common foods are built in — type above to search them",today:"Today",recipes:"Recipes",shopping:"Shopping",settings:"Settings",search:"Search recipes or ingredients…",
noRecipes:"No recipes yet. Tap + to add one, or import a recipe Claude made for you.",noMatch:"No recipes match your search.",
kcal:"kcal",perServing:"per serving",servings:"Servings",protein:"Protein",carbs:"Carbs",fat:"Fat",time:"Time (min)",min:"min",
ingredients:"Ingredients",steps:"Steps",notes:"Notes",source:"Source",edit:"Edit",del:"Delete",delAgain:"Tap again to delete",
save:"Save",cancel:"Cancel",newRecipe:"New recipe",editRecipe:"Edit recipe",name:"Name",ingName:"Ingredient",amount:"Amount",
addIng:"+ Add ingredient",stepsHint:"one step per line",tags:"Tags (comma separated)",calcFromIng:"from ingredients",
kcalServing:"Calories per serving",macrosServing:"Macros per serving (g)",addToday:"Add to today",added:"Added",saved:"Saved",deleted:"Deleted",
goal:"Goal",left:"left",over:"over",eaten:"eaten",quickAdd:"Log food",whatAte:"What did you eat?",nothing:"Nothing logged yet for this day.",
setGoal:"Daily calorie goal",fromRecipe:"From recipe",add:"Add",
cloud:"Synced",local:"Demo mode — saved on this device only",offline:"Offline — showing saved copy",
loading:"Loading…",needName:"Please enter a name",prev:"Previous day",next:"Next day",todayBtn:"Back to today",total:"Total",
toShop:"Add to shopping list",addItem:"Add an item…",shopEmpty:"Your shopping list is empty.",shopEmpty2:"Add items above, or add ingredients from a recipe.",
fromRecipes:"Add from recipe",inCart:"In the cart",toBuy:"To buy",clearDone:"Clear checked",clearAll:"Clear all",clearAgain:"Tap again to clear",
copy:"Copy list",copyCode:"Copy code",copied:"Copied",copyFail:"Couldn't copy",itemsAdded:"added to shopping list",chooseIng:"Choose ingredients",
selectAll:"All",selectNone:"None",pickRecipe:"Pick a recipe",bought:"bought",of:"of",noIngs:"This recipe has no ingredients yet.",
signIn:"Sign in",signUp:"Create account",email:"Email",password:"Password",yourName:"Your name",forgot:"Forgot password?",
checkEmail:"Check your email to confirm your account, then sign in here.",resetSent:"Password reset email sent.",
newPassword:"New password",setPassword:"Set new password",pwChanged:"Password changed",tagline:"Recipes · calories · shopping",
welcome:"Welcome!",hhIntro:"Recipes and the shopping list are shared with your household. Your calorie log stays private.",
createHh:"Create a household",hhName:"Household name",joinHh:"Join with an invite code",inviteCode:"Invite code",create:"Create",join:"Join",
household:"Household",members:"Members",invite:"Invite family",inviteHint:"Share this code. They create an account, then choose “Join with an invite code”.",
newCode:"New code",account:"Account",signOut:"Sign out",language:"Language",theme:"Theme",light:"Light",dark:"Dark",
data:"Recipes data",importR:"Import recipes",exportR:"Export all recipes",importHint:"Paste the recipe text Claude gave you (JSON). One recipe or a list.",
imported:"recipes imported",badJson:"That doesn't look like recipe data.",exported:"Recipes copied and downloaded",
install:"Install this app",installIos:"Tap the Share button, then “Add to Home Screen”.",installBtn:"Install",dismiss:"Close",
switchHh:"Switch to another household",rename:"Rename",you:"you",demoNote:"Demo mode: connect Supabase in config.js to sync between devices.",
version:"Version",
aiImport:"Import with AI",aiSub:"From Instagram, Facebook, TikTok, YouTube or any recipe site",aiLink:"Link to the post or recipe",
aiText:"Caption or recipe text (optional)",aiTextHint:"Tip: in Instagram tap ••• → Copy, or open the caption and copy it",aiShots:"Screenshots (optional)",
aiAddShots:"Add screenshots",aiGo:"Create recipe",aiWorking:"Reading the recipe… (10–30 seconds)",aiCheck:"Check the recipe and tap Save",
aiNeedInput:"Paste a link, the caption text or add screenshots.",aiDemo:"AI import needs the synced version (Supabase).",
aiSetup:"AI import isn't set up yet in Supabase (see README, step 6).",aiLinkWarn:"Couldn't open the link itself — the recipe was made from the text/screenshots.",aiLinkOnly:"This site only shared the title, not the recipe. Copy the post text (See more → copy) into the box above, or add screenshots of the ingredients, then tap Create recipe again."},
he:{app:"תזונה",products:"מוצרים",myProducts:"המוצרים שלי",commonFoods:"מזונות נפוצים",onlineRes:"Open Food Facts",searchProducts:"חיפוש מוצר…",
searchOnline:"חיפוש ברשת",noProducts:"אין עדיין מוצרים שמורים. הוסף בצילום, חפש ברשת, או השתמש במזונות הנפוצים למטה.",
addProduct:"הוספת מוצר",editProduct:"עריכת מוצר",fromPhoto:"מילוי מצילום (AI)",fromPhotoHint:"צילום של חזית האריזה ו/או הטבלה התזונתית",
brand:"מותג",barcode:"ברקוד",lookup:"חיפוש",unit:"יחידה",per100:"ל-100",servingSize:"גודל מנה",servingName:"שם המנה",
sugar:"סוכר",fiber:"סיבים",saveToMine:"שמירה למוצרים שלי",savedToMine:"נשמר למוצרים שלי",notFound:"לא נמצא",
searching:"מחפש…",reading:"קורא את הצילום…",estimated:"הערכים משוערים — בדוק מול התווית",needPhoto:"הוסף קודם צילום",
needOnline:"חיפוש ברשת זמין רק בגרסה המסונכרנת",offNote:"נתונים מ-Open Food Facts (מאגר קהילתי) — בדוק את הערכים",
translateTo:"תרגום לעברית",translating:"מתרגם…",translated:"תורגם",amountHint:"למשל 150 גרם, 2, כוס",
autoCalc:"מחושב",video:"הוספת סרטון (הקלטת מסך)",videoHint:"הקלט את המסך בזמן שהסרטון מתנגן, והוסף את ההקלטה כאן",
preparingVideo:"מכין את הסרטון…",videoReady:"הסרטון מוכן",videoNoAudio:"לא נמצא קול — משתמש בתמונות בלבד",videoFail:"לא הצלחתי לקרוא את הסרטון — נסה צילומי מסך",
grams:"גרם",askAI:"לשאול את ה-AI על מתכון",askSub:"למשל \u201dאיך לבשל עדשים חומות\u201d \u2014 ותקבל כמה אפשרויות לבחירה",askPlaceholder:"מה תרצה לבשל?",
askGo:"קבלת מתכונים",askVariants:"אפשרויות",askThinking:"חושב על מתכונים… (10–30 שניות)",addRecipe:"הוספה",added2:"נוסף ✓",editFirst:"עריכה קודם",
showMore:"מצרכים ושלבים",askEx1:"איך לבשל עדשים חומות",askEx2:"ארוחת בוקר עשירה בחלבון",askEx3:"ארוחת ערב מהירה עם חזה עוף",askEx4:"חטיף בריא עד 200 קלוריות",perServ:"למנה",needDbUpdate:"המוצר נשמר בלי תמונה — הרץ את 003_product_images.sql ב-Supabase כדי להפעיל תמונות",findPicture:"חיפוש תמונה ברשת",choosePicture:"בחירת תמונה",noPictures:"לא נמצאו תמונות — נסה שם קצר יותר, או צלם",picSources:"תמונות: Open Food Facts, ויקיפדיה",picture:"תמונה",addPicture:"הוספת תמונה",changePicture:"החלפה",removePicture:"הסרה",uploading:"שומר תמונה…",picFail:"לא הצלחתי לשמור את התמונה: ",commonHint:"{n} מזונות נפוצים כבר מובנים — הקלד למעלה כדי לחפש",today:"היום",recipes:"מתכונים",shopping:"קניות",settings:"הגדרות",search:"חיפוש מתכון או מצרך…",
noRecipes:"אין עדיין מתכונים. לחץ + כדי להוסיף, או ייבא מתכון ש-Claude הכין לך.",noMatch:"לא נמצאו מתכונים.",
kcal:"קק״ל",perServing:"למנה",servings:"מנות",protein:"חלבון",carbs:"פחמימות",fat:"שומן",time:"זמן (דק׳)",min:"דק׳",
ingredients:"מצרכים",steps:"אופן הכנה",notes:"הערות",source:"מקור",edit:"עריכה",del:"מחיקה",delAgain:"לחץ שוב למחיקה",
save:"שמירה",cancel:"ביטול",newRecipe:"מתכון חדש",editRecipe:"עריכת מתכון",name:"שם",ingName:"מצרך",amount:"כמות",
addIng:"+ הוספת מצרך",stepsHint:"שלב אחד בכל שורה",tags:"תגיות (מופרדות בפסיק)",calcFromIng:"מחושב מהמצרכים",
kcalServing:"קלוריות למנה",macrosServing:"ערכים למנה (גרם)",addToday:"הוסף להיום",added:"נוסף",saved:"נשמר",deleted:"נמחק",
goal:"יעד",left:"נותרו",over:"מעל",eaten:"נאכלו",quickAdd:"רישום אוכל",whatAte:"מה אכלת?",nothing:"עדיין לא נרשם כלום ביום הזה.",
setGoal:"יעד קלוריות יומי",fromRecipe:"ממתכון",add:"הוסף",
cloud:"מסונכרן",local:"מצב הדגמה — נשמר במכשיר הזה בלבד",offline:"אין חיבור — מוצג עותק שמור",
loading:"טוען…",needName:"נא להזין שם",prev:"יום קודם",next:"יום הבא",todayBtn:"חזרה להיום",total:"סה״כ",
toShop:"הוסף לרשימת קניות",addItem:"הוספת פריט…",shopEmpty:"רשימת הקניות ריקה.",shopEmpty2:"הוסף פריטים למעלה, או מצרכים ממתכון.",
fromRecipes:"הוספה ממתכון",inCart:"בעגלה",toBuy:"לקנות",clearDone:"ניקוי מסומנים",clearAll:"ניקוי הכל",clearAgain:"לחץ שוב לניקוי",
copy:"העתקת רשימה",copyCode:"העתקת קוד",copied:"הועתק",copyFail:"ההעתקה נכשלה",itemsAdded:"נוספו לרשימת הקניות",chooseIng:"בחירת מצרכים",
selectAll:"הכל",selectNone:"כלום",pickRecipe:"בחירת מתכון",bought:"נקנו",of:"מתוך",noIngs:"אין עדיין מצרכים במתכון הזה.",
signIn:"כניסה",signUp:"הרשמה",email:"אימייל",password:"סיסמה",yourName:"השם שלך",forgot:"שכחת סיסמה?",
checkEmail:"בדוק את האימייל כדי לאשר את החשבון, ואז היכנס כאן.",resetSent:"נשלח אימייל לאיפוס סיסמה.",
newPassword:"סיסמה חדשה",setPassword:"קביעת סיסמה חדשה",pwChanged:"הסיסמה שונתה",tagline:"מתכונים · קלוריות · קניות",
welcome:"ברוך הבא!",hhIntro:"מתכונים ורשימת קניות משותפים לכל בני הבית. יומן הקלוריות שלך נשאר פרטי.",
createHh:"יצירת משק בית",hhName:"שם משק הבית",joinHh:"הצטרפות עם קוד הזמנה",inviteCode:"קוד הזמנה",create:"יצירה",join:"הצטרפות",
household:"משק בית",members:"חברים",invite:"הזמנת בני משפחה",inviteHint:"שתף את הקוד. הם נרשמים ובוחרים “הצטרפות עם קוד הזמנה”.",
newCode:"קוד חדש",account:"חשבון",signOut:"יציאה",language:"שפה",theme:"ערכת צבע",light:"בהיר",dark:"כהה",
data:"נתוני מתכונים",importR:"ייבוא מתכונים",exportR:"ייצוא כל המתכונים",importHint:"הדבק את טקסט המתכון ש-Claude נתן לך (JSON). מתכון אחד או רשימה.",
imported:"מתכונים יובאו",badJson:"זה לא נראה כמו נתוני מתכון.",exported:"המתכונים הועתקו והורדו",
install:"התקנת האפליקציה",installIos:"לחץ על כפתור השיתוף ואז “הוסף למסך הבית”.",installBtn:"התקנה",dismiss:"סגירה",
switchHh:"מעבר למשק בית אחר",rename:"שינוי שם",you:"את/ה",demoNote:"מצב הדגמה: חבר את Supabase בקובץ config.js כדי לסנכרן בין מכשירים.",
version:"גרסה",
aiImport:"ייבוא עם AI",aiSub:"מאינסטגרם, פייסבוק, טיקטוק, יוטיוב או כל אתר מתכונים",aiLink:"קישור לפוסט או למתכון",
aiText:"טקסט הפוסט או המתכון (לא חובה)",aiTextHint:"טיפ: באינסטגרם לחץ ••• → העתקה, או פתח את הכיתוב והעתק אותו",aiShots:"צילומי מסך (לא חובה)",
aiAddShots:"הוספת צילומי מסך",aiGo:"יצירת מתכון",aiWorking:"קורא את המתכון… (10–30 שניות)",aiCheck:"בדוק את המתכון ולחץ שמירה",
aiNeedInput:"הדבק קישור, טקסט או הוסף צילומי מסך.",aiDemo:"ייבוא עם AI זמין רק בגרסה המסונכרנת (Supabase).",
aiSetup:"ייבוא עם AI עדיין לא הוגדר ב-Supabase (ראה README, שלב 6).",aiLinkWarn:"לא הצלחתי לפתוח את הקישור עצמו — המתכון נוצר מהטקסט/צילומי המסך.",aiLinkOnly:"האתר שיתף רק את הכותרת, בלי המתכון. העתק את טקסט הפוסט (עוד → העתקה) לתיבה למעלה, או הוסף צילומי מסך של המצרכים, ואז לחץ שוב על יצירת מתכון."}
};
const VERSION = "1.4.0";

/* =================== small utils =================== */
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
          set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
          del(k){try{localStorage.removeItem(k)}catch(e){}}};
let lang=LS.get("nt.lang",(navigator.language||"").startsWith("he")?"he":"en");
let theme=LS.get("nt.theme",(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");
const t=k=>(T[lang]&&T[lang][k])||T.en[k]||k;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=v=>{const n=parseFloat(String(v??"").replace(",","."));return isFinite(n)?n:0};
const numOrNull=v=>(v===""||v==null||!isFinite(parseFloat(String(v).replace(",","."))))?null:num(v);
const r0=n=>Math.round(n), r1=n=>Math.round(n*10)/10;
const uuid=()=>(crypto.randomUUID?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)));
const dkey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const norm=s=>String(s||"").trim().toLowerCase();
const $=s=>document.querySelector(s);
const ICON={
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l2.5 12.3a2 2 0 0 0 2 1.7h8.1a2 2 0 0 0 2-1.6L21 8H6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21V9M7 14l5-5 5 5M4 3h16"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  film:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>',
  image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
  wifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.3-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 5M12 20h.01"/></svg>'
};
const GRADS=[["#f08a4b","#e0613a"],["#4fae7f","#2e7d5b"],["#5b8def","#3a62c9"],["#d266a0","#a8457d"],["#e2b33c","#c48e14"],["#7a6ff0","#5146c4"],["#33b3b0","#1f8584"],["#ef6b6b","#c74646"]];
function grad(name){let h=0;for(const c of String(name||""))h=(h*31+c.codePointAt(0))>>>0;const g=GRADS[h%GRADS.length];return `linear-gradient(135deg,${g[0]},${g[1]})`}
const initial=n=>[...String(n||"?").trim()][0]||"?";
function toast(m){const el=$("#toast");el.textContent=m;el.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove("on"),2000)}
function errMsg(e){return (e&&(e.message||e.error_description||e.msg))||String(e||"Error")}
async function safe(fn){try{return await fn()}catch(e){console.error(e);toast(errMsg(e))}}

/* =================== mapping =================== */
function recipeFromRow(r){return {id:r.id,name:r.name,servings:num(r.servings)||1,time:r.time_min,ingredients:r.ingredients||[],
  kcalPerServing:r.kcal_per_serving,protein:r.protein,carbs:r.carbs,fat:r.fat,steps:r.steps||[],tags:r.tags||[],
  notes:r.notes||"",source:r.source||"",createdAt:r.created_at,updatedAt:r.updated_at}}
function recipeToRow(r,hid){return {id:r.id,household_id:hid,name:r.name,servings:num(r.servings)||1,time_min:numOrNull(r.time),
  ingredients:(r.ingredients||[]).map(i=>{const o={name:i.name||"",amount:i.amount||"",kcal:numOrNull(i.kcal)};
    if(i.protein!=null)o.protein=numOrNull(i.protein);if(i.carbs!=null)o.carbs=numOrNull(i.carbs);if(i.fat!=null)o.fat=numOrNull(i.fat);
    if(i.food)o.food=i.food;return o}),
  kcal_per_serving:numOrNull(r.kcalPerServing),protein:numOrNull(r.protein),carbs:numOrNull(r.carbs),fat:numOrNull(r.fat),
  steps:r.steps||[],tags:r.tags||[],notes:r.notes||null,source:r.source||null}}
const shopFromRow=r=>({id:r.id,name:r.name,amount:r.amount||"",done:!!r.done,recipes:r.recipes||[],createdAt:r.created_at});
const prodFromRow=r=>({id:r.id,updatedAt:r.updated_at,name:r.name,brand:r.brand||"",barcode:r.barcode||"",category:r.category||"",unit:r.unit||"g",
  serving_g:r.serving_g==null?null:num(r.serving_g),serving_name:r.serving_name||"",kcal:numOrNull(r.kcal),protein:numOrNull(r.protein),
  carbs:numOrNull(r.carbs),fat:numOrNull(r.fat),sugar:numOrNull(r.sugar),fiber:numOrNull(r.fiber),source:r.source||"",image:r.image||""});
const prodToRow=(p,hid)=>({id:p.id,household_id:hid,name:p.name,brand:p.brand||null,barcode:p.barcode||null,category:p.category||null,unit:p.unit==="ml"?"ml":"g",
  serving_g:numOrNull(p.serving_g),serving_name:p.serving_name||null,kcal:numOrNull(p.kcal),protein:numOrNull(p.protein),carbs:numOrNull(p.carbs),
  fat:numOrNull(p.fat),sugar:numOrNull(p.sugar),fiber:numOrNull(p.fiber),source:p.source||null,image:p.image||null});
const logFromRow=r=>({id:r.id,day:r.day,name:r.name,recipeId:r.recipe_id,servings:num(r.servings),kcal:num(r.kcal),protein:num(r.protein),carbs:num(r.carbs),fat:num(r.fat),createdAt:r.created_at});

/* =================== backends =================== */
/* Local (demo) backend: same interface, stored in this browser. */
const LocalBackend={
  mode:"local",
  async init(){return {user:{id:"local",email:""},household:{id:"local",name:t("household"),invite_code:null},members:[]}},
  _get(k){return LS.get("nt2."+k,[])}, _set(k,v){LS.set("nt2."+k,v);this._notify(k)},
  _notify(k){this.onChange&&this.onChange(k)},
  async listRecipes(){return this._get("recipes")},
  async saveRecipe(r){const a=this._get("recipes");const i=a.findIndex(x=>x.id===r.id);const now=new Date().toISOString();
    r={...r,updatedAt:now,createdAt:r.createdAt||now};if(i>=0)a[i]=r;else a.push(r);this._set("recipes",a);return r},
  async saveRecipes(list){for(const r of list)await this.saveRecipe(r)},
  async deleteRecipe(id){this._set("recipes",this._get("recipes").filter(x=>x.id!==id))},
  async listShop(){return this._get("shop")},
  async insertShop(items){this._set("shop",[...this._get("shop"),...items])},
  async updateShop(id,patch){this._set("shop",this._get("shop").map(i=>i.id===id?{...i,...patch}:i))},
  async deleteShop(ids){const s=new Set(ids);this._set("shop",this._get("shop").filter(i=>!s.has(i.id)))},
  async listLog(day){return LS.get("nt2.log."+day,[])},
  async addLog(e){const a=LS.get("nt2.log."+e.day,[]);a.push(e);LS.set("nt2.log."+e.day,a);this._notify("log")},
  async deleteLog(day,id){LS.set("nt2.log."+day,LS.get("nt2.log."+day,[]).filter(x=>x.id!==id));this._notify("log")},
  async listProducts(){return this._get("products")},
  async saveProduct(p){const a=this._get("products");const i=a.findIndex(x=>x.id===p.id);if(i>=0)a[i]=p;else a.push(p);this._set("products",a);return p},
  async deleteProduct(id){this._set("products",this._get("products").filter(x=>x.id!==id))},
  async uploadImage(blob){return await new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(blob)})},
  async callFn(){const e=new Error(t("needOnline"));e.code="demo";throw e},
  async getSettings(){return LS.get("nt2.settings",{goal:2000})},
  async saveSettings(s){LS.set("nt2.settings",{...LS.get("nt2.settings",{goal:2000}),...s})},
  subscribe(cb){this.onChange=cb;window.addEventListener("storage",e=>{if(e.key&&e.key.startsWith("nt2."))cb("all")})},
};

/* Supabase backend */
const SupaBackend={
  mode:"cloud", sb:null, user:null, household:null, channel:null,
  async client(){
    if(this.sb)return this.sb;
    const {createClient}=await import(SUPABASE_ESM);
    this.sb=createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return this.sb;
  },
  async session(){const sb=await this.client();const {data}=await sb.auth.getSession();return data.session},
  async householdFor(user){
    const sb=this.sb;
    const {data:st}=await sb.from("settings").select("*").eq("user_id",user.id).maybeSingle();
    let hid=st&&st.household_id;
    if(!hid){const {data:m}=await sb.from("members").select("household_id").eq("user_id",user.id).limit(1);hid=m&&m[0]&&m[0].household_id}
    if(!hid)return null;
    const {data:h,error}=await sb.from("households").select("*").eq("id",hid).maybeSingle();
    if(error)throw error; return h;
  },
  async members(){if(!this.household)return [];
    const {data,error}=await this.sb.from("members").select("user_id,display_name,joined_at").eq("household_id",this.household.id).order("joined_at");
    if(error)throw error;return data||[]},
  async createHousehold(name,display){const {data,error}=await this.sb.rpc("create_household",{p_name:name,p_display_name:display});if(error)throw error;this.household=data;return data},
  async joinHousehold(code,display){const {data,error}=await this.sb.rpc("join_household",{p_code:code,p_display_name:display});if(error)throw error;this.household=data;return data},
  async newInviteCode(){const {data,error}=await this.sb.rpc("new_invite_code",{p_household:this.household.id});if(error)throw error;this.household.invite_code=data;return data},
  async renameHousehold(name){const {error}=await this.sb.from("households").update({name}).eq("id",this.household.id);if(error)throw error;this.household.name=name},
  async renameMe(display){const {error}=await this.sb.from("members").update({display_name:display}).eq("household_id",this.household.id).eq("user_id",this.user.id);if(error)throw error},
  async listRecipes(){const {data,error}=await this.sb.from("recipes").select("*").eq("household_id",this.household.id);if(error)throw error;return data.map(recipeFromRow)},
  async saveRecipe(r){const {data,error}=await this.sb.from("recipes").upsert(recipeToRow(r,this.household.id)).select().single();if(error)throw error;return recipeFromRow(data)},
  async saveRecipes(list){if(!list.length)return;const {error}=await this.sb.from("recipes").upsert(list.map(r=>recipeToRow(r,this.household.id)));if(error)throw error},
  async deleteRecipe(id){const {error}=await this.sb.from("recipes").delete().eq("id",id);if(error)throw error},
  async listShop(){const {data,error}=await this.sb.from("shopping_items").select("*").eq("household_id",this.household.id).order("created_at");if(error)throw error;return data.map(shopFromRow)},
  async insertShop(items){if(!items.length)return;const hid=this.household.id;
    const {error}=await this.sb.from("shopping_items").insert(items.map(i=>({id:i.id,household_id:hid,name:i.name,amount:i.amount||null,done:!!i.done,recipes:i.recipes||[]})));if(error)throw error},
  async updateShop(id,patch){const {error}=await this.sb.from("shopping_items").update(patch).eq("id",id);if(error)throw error},
  async deleteShop(ids){if(!ids.length)return;const {error}=await this.sb.from("shopping_items").delete().in("id",ids);if(error)throw error},
  async listLog(day){const {data,error}=await this.sb.from("food_log").select("*").eq("user_id",this.user.id).eq("day",day).order("created_at");if(error)throw error;return data.map(logFromRow)},
  async addLog(e){const {error}=await this.sb.from("food_log").insert({id:e.id,user_id:this.user.id,day:e.day,name:e.name,recipe_id:e.recipeId||null,
    servings:e.servings||1,kcal:e.kcal||0,protein:e.protein||0,carbs:e.carbs||0,fat:e.fat||0});if(error)throw error},
  async deleteLog(day,id){const {error}=await this.sb.from("food_log").delete().eq("id",id);if(error)throw error},
  async getSettings(){const {data}=await this.sb.from("settings").select("*").eq("user_id",this.user.id).maybeSingle();return {goal:2000,...(data||{})}},
  async saveSettings(s){const {error}=await this.sb.from("settings").upsert({user_id:this.user.id,...s});if(error)throw error},
  async listProducts(){const {data,error}=await this.sb.from("products").select("*").eq("household_id",this.household.id);if(error){if(/products/.test(error.message||""))return [];throw error}return data.map(prodFromRow)},
  async saveProduct(p){
    let row=prodToRow(p,this.household.id);
    let {data,error}=await this.sb.from("products").upsert(row).select().single();
    // database not updated for pictures yet (003_product_images.sql) → save without the picture instead of failing
    if(error&&/image/i.test(error.message||"")&&/column|schema cache/i.test(error.message||"")){
      const {image,...rest}=row;({data,error}=await this.sb.from("products").upsert(rest).select().single());
      if(!error)this.warn=t("needDbUpdate")}
    if(error)throw error;return prodFromRow(data)},
  async deleteProduct(id){const {error}=await this.sb.from("products").delete().eq("id",id);if(error)throw error;
    this.sb.storage.from("product-images").remove([`${this.household.id}/${id}.jpg`]).catch(()=>{})},
  async uploadImage(blob,id){const path=`${this.household.id}/${id}.jpg`;
    const {error}=await this.sb.storage.from("product-images").upload(path,blob,{upsert:true,contentType:"image/jpeg",cacheControl:"86400"});
    if(error){if(/bucket not found|not found/i.test(error.message||""))error.message=t("needDbUpdate");throw error}const {data}=this.sb.storage.from("product-images").getPublicUrl(path);return data.publicUrl+"?v="+Date.now()},
  async callFn(body){return this.importAI(body)},
  async importAI(body){
    const {data,error}=await this.sb.functions.invoke("import-recipe",{body});
    if(error){let info=null;try{info=await error.context.json()}catch(_){}
      const e=new Error((info&&info.message)||error.message||"Error");e.code=(info&&info.error)||(/not found|404|Failed to send/i.test(error.message||"")?"setup":"ai");throw e}
    return data;
  },
  subscribe(cb){
    if(this.channel)this.sb.removeChannel(this.channel);
    const hid=this.household.id, uid=this.user.id;
    this.channel=this.sb.channel("hh-"+hid)
      .on("postgres_changes",{event:"*",schema:"public",table:"recipes",filter:"household_id=eq."+hid},()=>cb("recipes"))
      .on("postgres_changes",{event:"*",schema:"public",table:"shopping_items",filter:"household_id=eq."+hid},()=>cb("shop"))
      .on("postgres_changes",{event:"*",schema:"public",table:"food_log",filter:"user_id=eq."+uid},()=>cb("log"))
      .on("postgres_changes",{event:"*",schema:"public",table:"products",filter:"household_id=eq."+hid},()=>cb("products"))
      .subscribe(st=>{S.live=(st==="SUBSCRIBED");setStatus()});
  }
};

/* =================== app state =================== */
const S={api:null,phase:"boot",user:null,household:null,members:[],recipes:[],shop:[],products:[],log:{},settings:{goal:2000},
  loaded:false,live:false,online:navigator.onLine,pending:{recipes:0,shop:0,log:0,products:0}};
let route={tab:LS.get("nt.tab","recipes"),view:"list",id:null,prevTab:"recipes"};
let query="",tagFilter="",curDate=dkey(new Date()),delArm=null,clearArm=false,authMode="in",authMsg="",authErr="";

function cacheKey(k){return "nt2.cache."+(S.household&&S.household.id)+"."+k}
function saveCache(){if(S.api&&S.api.mode==="cloud"){LS.set(cacheKey("recipes"),S.recipes);LS.set(cacheKey("shop"),S.shop);LS.set(cacheKey("products"),S.products)}}
function loadCache(){S.recipes=LS.get(cacheKey("recipes"),[]);S.shop=LS.get(cacheKey("shop"),[]);S.products=LS.get(cacheKey("products"),[])}

const refetchTimers={};
function refetch(kind,delay=250){
  if(kind==="all"){["recipes","shop","log","products"].forEach(k=>refetch(k,delay));return}
  clearTimeout(refetchTimers[kind]);
  refetchTimers[kind]=setTimeout(async()=>{
    if(S.pending[kind]>0){refetch(kind,400);return}
    try{
      if(kind==="recipes")S.recipes=await S.api.listRecipes();
      else if(kind==="shop")S.shop=await S.api.listShop();
      else if(kind==="log")S.log[curDate]=await S.api.listLog(curDate);
      else if(kind==="products")S.products=await S.api.listProducts();
      S.online=true;saveCache();rerender();
    }catch(e){console.warn(e);if(!navigator.onLine){S.online=false;setStatus()}}
  },delay);
}
/* run a write with optimistic state already applied; track pending so refetches don't flicker */
async function write(kind,fn){S.pending[kind]++;try{await fn()}catch(e){console.error(e);toast(errMsg(e));S.pending[kind]--;refetch(kind,0);return false}
  S.pending[kind]--;return true}

/* =================== boot =================== */
async function boot(){
  applyChrome();
  S.api=CLOUD?SupaBackend:LocalBackend;
  if(!CLOUD){
    const ctx=await LocalBackend.init();S.user=ctx.user;S.household=ctx.household;
    await loadAll();LocalBackend.subscribe(k=>refetch(k==="all"?"all":k,0));S.phase="app";render();return;
  }
  try{
    const sb=await SupaBackend.client();
    sb.auth.onAuthStateChange((ev,session)=>{
      if(ev==="PASSWORD_RECOVERY"){sheetNewPassword();return}
      if(ev==="SIGNED_OUT"){S.user=null;S.household=null;S.phase="auth";authMode="in";authErr=authMsg="";render();return}
      if(ev==="SIGNED_IN"&&S.phase==="auth"&&session)afterLogin(session.user);
    });
    const session=await SupaBackend.session();
    if(!session){S.phase="auth";render();return}
    await afterLogin(session.user);
  }catch(e){
    console.error(e);S.online=false;S.phase="error";S.bootError=errMsg(e);render();
  }
}
async function afterLogin(user){
  S.user=user;SupaBackend.user=user;S.phase="loading";render();
  try{
    const h=await SupaBackend.householdFor(user);
    if(!h){S.phase="onboard";render();return}
    await enterHousehold(h);
  }catch(e){
    console.error(e);
    // offline start: use last known household + cached data
    const last=LS.get("nt2.lastHousehold",null);
    if(last){S.household=last;SupaBackend.household=last;loadCache();S.online=false;S.phase="app";render()}
    else{S.phase="error";S.bootError=errMsg(e);render()}
  }
}
async function enterHousehold(h){
  S.household=h;SupaBackend.household=h;LS.set("nt2.lastHousehold",h);
  loadCache();S.phase="app";render();
  await loadAll();
  SupaBackend.subscribe(k=>refetch(k));
  S.members=await SupaBackend.members().catch(()=>[]);
  consumeShare();
}
async function loadAll(){
  try{
    const [rec,shop,log,st,prods]=await Promise.all([S.api.listRecipes(),S.api.listShop(),S.api.listLog(curDate),S.api.getSettings(),S.api.listProducts().catch(()=>[])]);
    S.recipes=rec;S.shop=shop;S.log[curDate]=log;S.products=prods;S.settings={goal:2000,...st};S.loaded=true;S.online=true;saveCache();
  }catch(e){console.warn(e);S.online=false}
  rerender();
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&S.phase==="app"){refetch("all",0);
  if(dkey(new Date())!==LS.get("nt.lastDay",""))LS.set("nt.lastDay",dkey(new Date()))}});
window.addEventListener("online",()=>{S.online=true;if(S.phase==="app")refetch("all",0);setStatus()});
window.addEventListener("offline",()=>{S.online=false;setStatus()});

/* =================== recipe math =================== */
function perServing(r){
  const sv=Math.max(1,num(r.servings)||1),ings=r.ingredients||[];
  const sum=k=>ings.reduce((a,i)=>a+num(i[k]),0),has=k=>ings.some(i=>i[k]!=null&&i[k]!=="");
  const ingK=sum("kcal");
  const kcal=num(r.kcalPerServing)||(ingK?ingK/sv:0);
  const m=k=>(r[k]!=null&&r[k]!=="")?num(r[k]):(has(k)?sum(k)/sv:0);
  return {kcal,protein:m("protein"),carbs:m("carbs"),fat:m("fat")};
}
/* ---------- foods: my products + built-in common foods ---------- */
const EMOJI=[["egg white","🥚"],["eggplant","🍆"],["egg","🥚"],["milk","🥛"],["cottage","🧀"],["cheese","🧀"],["parmesan","🧀"],["mozzarella","🧀"],["labaneh","🥣"],["yogurt","🥣"],
  ["butter","🧈"],["cream","🥛"],["chicken","🍗"],["turkey","🦃"],["beef","🥩"],["steak","🥩"],["salmon","🐟"],["tuna","🐟"],["fish","🐟"],["sardine","🐟"],["schnitzel","🍗"],
  ["rice cake","🍘"],["rice","🍚"],["pasta","🍝"],["couscous","🍚"],["bulgur","🌾"],["quinoa","🌾"],["oats","🌾"],["bread","🍞"],["pita","🫓"],["tortilla","🫓"],["flour","🌾"],
  ["corn flakes","🥣"],["granola","🥣"],["chickpea","🫘"],["lentil","🫘"],["bean","🫘"],["peas","🫛"],["tofu","🧊"],["edamame","🫛"],["hummus","🥙"],["tahini","🥙"],["falafel","🧆"],
  ["cherry tomato","🍅"],["tomato","🍅"],["cucumber","🥒"],["onion","🧅"],["garlic","🧄"],["pepper","🫑"],["carrot","🥕"],["sweet potato","🍠"],["potato","🥔"],["zucchini","🥒"],
  ["broccoli","🥦"],["cauliflower","🥦"],["cabbage","🥬"],["lettuce","🥬"],["spinach","🥬"],["mushroom","🍄"],["corn","🌽"],["beet","🟣"],["pumpkin","🎃"],["celery","🥬"],
  ["parsley","🌿"],["avocado","🥑"],["olive oil","🫒"],["olive","🫒"],["pickle","🥒"],["apple","🍎"],["banana","🍌"],["orange juice","🧃"],["orange","🍊"],["clementine","🍊"],
  ["grape","🍇"],["strawberr","🍓"],["blueberr","🫐"],["watermelon","🍉"],["melon","🍈"],["mango","🥭"],["pear","🍐"],["peach","🍑"],["pomegranate","🔴"],["date","🌴"],
  ["lemon","🍋"],["raisin","🍇"],["almond","🌰"],["walnut","🌰"],["cashew","🌰"],["peanut","🥜"],["seed","🌻"],["chia","🌱"],["sesame","🌱"],["oil","🫗"],["mayonnaise","🥫"],
  ["honey","🍯"],["sugar","🧂"],["silan","🍯"],["jam","🍓"],["chocolate","🍫"],["ketchup","🍅"],["soy","🥢"],["tomato paste","🥫"],["crushed","🥫"],["coca","🥤"],["beer","🍺"],
  ["wine","🍷"],["coffee","☕"],["latte","☕"],["protein","💪"],["bamba","🥜"],["bissli","🥨"],["fries","🍟"],["pizza","🍕"],["shawarma","🌯"],["burekas","🥐"],["malawach","🫓"],["ice cream","🍨"]];
function foodEmoji(en){en=norm(en);for(const [k,e] of EMOJI)if(en.includes(k))return e;return ""}
/* ---------- real photos from Wikipedia (free, no key) ---------- */
const WIKI_CACHE_KEY="nt.wikiimg.v1";let wikiCache=LS.get(WIKI_CACHE_KEY,{}),wikiQueue=[],wikiBusy=0,wikiTimer=null;
const cleanFoodName=n=>String(n||"").replace(/\(.*?\)/g,"").replace(/\d+(\.\d+)?\s*%/g,"").replace(/[\/,].*$/,"").replace(/\s+/g," ").trim();
async function wikiSearch(q,wlang="en",limit=6){
  const u=`https://${wlang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=0&gsrlimit=${limit}`+
    `&gsrsearch=${encodeURIComponent(q)}&prop=pageimages&piprop=thumbnail&pithumbsize=320`;
  try{const r=await fetch(u);if(!r.ok)return [];const d=await r.json();
    return Object.values((d.query&&d.query.pages)||{}).sort((a,b)=>(a.index||0)-(b.index||0))
      .filter(p=>p.thumbnail&&p.thumbnail.source&&!/\.svg/i.test(p.thumbnail.source)).map(p=>({url:p.thumbnail.source,title:p.title,src:"Wikipedia"}))}
  catch(_){return []}
}
function commonImage(f){const k=f.en;if(!k)return "";
  if(k in wikiCache)return wikiCache[k]||"";
  if(!wikiQueue.includes(k)){wikiQueue.push(k);pumpWiki()}return ""}
function pumpWiki(){
  while(wikiBusy<3&&wikiQueue.length){const k=wikiQueue.shift();wikiBusy++;
    wikiSearch(cleanFoodName(k)+" food","en",3).then(list=>{wikiCache[k]=(list[0]&&list[0].url)||"";LS.set(WIKI_CACHE_KEY,wikiCache)})
      .finally(()=>{wikiBusy--;clearTimeout(wikiTimer);wikiTimer=setTimeout(()=>{if(S.phase==="app")rerender()},250);pumpWiki()})}
}
function thumbHTML(f,size=44){
  if(f&&f.common&&!f.image){const u=commonImage(f);if(u)f={...f,image:u}}
  if(f&&f.image)return `<img class="pthumb" style="width:${size}px;height:${size}px" src="${esc(f.image)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'pthumb ph',textContent:'${esc(initial(f.name)).replace(/'/g,"")}'}))">`;
  const em=f&&(f.emoji||foodEmoji(f.en||f.name));
  return `<span class="pthumb ${em?"emo":"ph"}" style="width:${size}px;height:${size}px;font-size:${Math.round(size*(em?0.55:0.42))}px;${em?"":"background:"+grad(f&&f.name)}">${esc(em||initial(f&&f.name))}</span>`;
}
function productFor(name){const n=norm(name);if(!n)return null;return S.products.find(p=>norm(p.name)===n)||commonFoods().find(c=>norm(c.name)===n||norm(c.alt)===n)||null}
function commonFoods(){
  if(commonFoods._c&&commonFoods._l===lang)return commonFoods._c;
  commonFoods._l=lang;
  return commonFoods._c=(window.COMMON_FOODS||[]).map((f,i)=>({id:"c:"+i,common:true,en:f[0],emoji:foodEmoji(f[0]),name:lang==="he"?f[1]:f[0],alt:lang==="he"?f[0]:f[1],
    kcal:f[2],protein:f[3],carbs:f[4],fat:f[5],serving_g:f[6]||null,serving_name:(lang==="he"?f[8]:f[7])||"",serving_alt:(lang==="he"?f[7]:f[8])||"",unit:f[9]||"g",brand:""}));
}
function searchFoods(q,limit=8,{mine=true,common=true}={}){
  q=norm(q);if(q.length<1)return [];
  const score=f=>{const n=norm(f.name),a=norm(f.alt||""),b=norm(f.brand||"");
    if(n===q)return 0;if(n.startsWith(q)||a.startsWith(q))return 1;if(n.includes(q)||a.includes(q))return 2;if(b.includes(q))return 3;
    const words=q.split(/\s+/);if(words.length>1&&words.every(w=>n.includes(w)||a.includes(w)))return 4;return 9};
  const pool=[...(mine?S.products.map(p=>({...p,mine:true})):[]),...(common?commonFoods():[])];
  return pool.map(f=>[score(f),f]).filter(x=>x[0]<9).sort((a,b)=>a[0]-b[0]||(b[1].mine?1:0)-(a[1].mine?1:0)).slice(0,limit).map(x=>x[1]);
}
const foodSnap=f=>({kcal:num(f.kcal),protein:num(f.protein),carbs:num(f.carbs),fat:num(f.fat),serving_g:f.serving_g||null,
  serving_name:f.serving_name||"",serving_alt:f.serving_alt||"",unit:f.unit||"g"});
/* amount text -> grams, using the food's serving size for "2", "1 slice", "2 eggs" */
function amountToGrams(text,food){
  let s=String(text||"").trim().toLowerCase().replace(",",".");if(!s)return null;
  s=s.replace(/\bhalf\b|חצי/g,"0.5").replace(/\bquarter\b|רבע/g,"0.25");
  const frac=s.match(/(\d+)\s*\/\s*(\d+)/);let n;
  if(frac)n=num(frac[1])/num(frac[2]);else{const m=s.match(/\d+(\.\d+)?/);n=m?num(m[0]):(/^[^\d]+$/.test(s)?1:NaN)}
  if(!isFinite(n)||n<=0)return null;
  const unit=s.replace(/[\d.\/\s]+/g," ").trim(),u0=unit.split(/\s+/)[0].replace(/[.״"׳']/g,"");
  const isU=list=>list.includes(u0);
  if(isU(["kg","קג","קילו","kilo","kilogram"]))return n*1000;
  if(isU(["l","liter","litre","ליטר"]))return n*1000;
  if(isU(["g","gr","gram","grams","גרם","גר","ג","ml","מל","מיליליטר"]))return n;
  if(isU(["tbsp","tablespoon","tablespoons","כף","כפות"]))return n*15;
  if(isU(["tsp","teaspoon","teaspoons","כפית","כפיות"]))return n*5;
  const sn=norm(food.serving_name).split(" ")[0],sa=norm(food.serving_alt).split(" ")[0];
  const same=w=>w&&(u0===w||u0.startsWith(w)||w.startsWith(u0)||(w.length>=3&&u0.length>=3&&u0.slice(0,3)===w.slice(0,3)));
  if(!unit||same(sn)||same(sa)||isU(["piece","pieces","pcs","unit","units","יחידה","יחידות"]))
    return food.serving_g?n*food.serving_g:(unit?null:n);
  if(isU(["cup","cups","כוס","כוסות"]))return n*240;
  return null;
}
function foodNutrition(food,amount){
  const g=amountToGrams(amount,food);if(g==null)return null;const k=g/100;
  return {grams:Math.round(g),kcal:Math.round(num(food.kcal)*k),protein:r1(num(food.protein)*k),carbs:r1(num(food.carbs)*k),fat:r1(num(food.fat)*k)};
}
const defaultAmount=f=>f.serving_g&&f.serving_name?("1 "+f.serving_name):("100 "+(f.unit==="ml"?"ml":t("grams")));
function suggestHTML(list){return list.length?`<div class="suggest">${list.map((f,i)=>`<button type="button" data-sug="${i}">${thumbHTML(f,30)}
  <span class="grow"><b>${esc(f.name)}</b>${f.brand?` <span class="muted small">${esc(f.brand)}</span>`:""}${f.mine?` <span class="mine">★</span>`:""}</span>
  <span class="muted small">${r0(num(f.kcal))} ${t("kcal")}/100</span></button>`).join("")}</div>`:""}

/* =================== chrome =================== */
function setStatus(){const el=$("#status");if(!el)return;
  if(S.phase!=="app"){el.innerHTML="";return}
  let cls="status",txt;
  if(!CLOUD){cls+=" local";txt=t("local")}
  else if(!S.online){cls+=" offline";txt=t("offline")}
  else txt=t("cloud")+(S.household?" · "+S.household.name:"");
  el.className=cls;el.innerHTML="<i></i>"+esc(txt)}
function applyChrome(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==="he"?"rtl":"ltr";
  document.documentElement.dataset.theme=theme;
  document.querySelector('meta[name=theme-color]').content=theme==="dark"?"#0f1311":"#f4f1ea";
  $("#langBtn").textContent=lang==="he"?"EN":"עב";
  $("#themeBtn").innerHTML=theme==="dark"?ICON.sun:ICON.moon;
  $("#backPath").setAttribute("d",lang==="he"?"M9 5l7 7-7 7":"M15 5l-7 7 7 7");
  document.querySelectorAll("[data-t]").forEach(el=>el.textContent=t(el.dataset.t));
  const open=S.shop.filter(i=>!i.done).length,b=$("#shopBadge");b.textContent=open;b.classList.toggle("hidden",!open);
}
function go(r){route={...route,...r};delArm=null;clearArm=false;
  if(r.tab&&["today","recipes","shopping","products"].includes(r.tab)){LS.set("nt.tab",r.tab);if(location.hash!=="#"+r.tab){try{history.replaceState(null,"","#"+r.tab)}catch(e){}}}
  render();window.scrollTo(0,0)}
function rerender(){ // re-render unless the user is typing in a form we'd destroy
  if(route.view==="edit"&&route.tab==="recipes"){applyChrome();setStatus();return}
  if(route.tab==="settings"&&document.activeElement&&document.activeElement.closest&&document.activeElement.closest("#view input")){applyChrome();return}
  render()}

function render(){
  applyChrome();setStatus();renderBanner();
  const inApp=S.phase==="app";
  $("#tabs").classList.toggle("hidden",!inApp);
  $("#gearBtn").classList.toggle("hidden",!inApp||route.tab==="settings");
  ["today","recipes","shopping","products"].forEach(k=>$("#tab"+k[0].toUpperCase()+k.slice(1)).classList.toggle("on",route.tab===k));
  const sub=inApp&&((route.tab==="recipes"&&route.view!=="list")||route.tab==="settings");
  $("#backBtn").classList.toggle("hidden",!sub);
  $("#fab").classList.toggle("hidden",!(inApp&&((route.tab==="recipes"&&route.view==="list")||route.tab==="today"||route.tab==="products")));
  const v=$("#view");
  if(S.phase==="boot"||S.phase==="loading"){$("#title").textContent="";v.innerHTML=`<div class="empty" style="padding-top:28vh">${t("loading")}</div>`;return}
  if(S.phase==="error"){$("#title").textContent=t("app");v.innerHTML=`<div class="card empty"><div class="em">${ICON.wifi}</div>${esc(S.bootError||"")}<br><br>
    <button class="btn primary" data-act="retry">↻</button></div>`;return}
  if(S.phase==="auth"){$("#title").textContent="";v.innerHTML=viewAuth();return}
  if(S.phase==="onboard"){$("#title").textContent="";v.innerHTML=viewOnboard();return}
  if(route.tab==="settings"){$("#title").textContent=t("settings");v.innerHTML=viewSettings();return}
  if(route.tab==="today"){$("#title").textContent=t("today");v.innerHTML=viewToday();if(!(curDate in S.log))refetch("log",0);return}
  if(route.tab==="products"){$("#title").textContent=t("products");
    const a=document.activeElement,keep=a&&a.id==="pq"?[a.value,a.selectionStart]:null;
    v.innerHTML=viewProducts();if(keep){const n=$("#pq");n.focus();try{n.setSelectionRange(keep[1],keep[1])}catch(_){}}return}
  if(route.tab==="shopping"){$("#title").textContent=t("shopping");
    const a=document.activeElement,keep=a&&a.id==="shopIn"?a.value:null;
    v.innerHTML=viewShop();if(keep!==null){const n=$("#shopIn");n.value=keep;n.focus()}return}
  if(route.view==="list"){$("#title").textContent=t("recipes");v.innerHTML=viewList();bindList();return}
  if(route.view==="detail"){const r=S.recipes.find(x=>x.id===route.id);if(!r){route.view="list";return render()}
    $("#title").textContent="";v.innerHTML=viewDetail(r);return}
  if(route.view==="edit"){const r=route.id?S.recipes.find(x=>x.id===route.id):null;
    $("#title").textContent=r?t("editRecipe"):t("newRecipe");
    if(!v.querySelector("#editForm")||v.dataset.editing!==(route.id||"new")){v.innerHTML=viewEdit(r);v.dataset.editing=route.id||"new";autoLinkRows();updIngSum()}return}
}

/* =================== install banner =================== */
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;renderBanner()});
const isStandalone=()=>(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
function renderBanner(){const b=$("#banner");if(!b)return;
  if(S.phase!=="app"||isStandalone()||LS.get("nt.installDismissed",false)||location.protocol==="file:"){b.innerHTML="";return}
  if(deferredPrompt)b.innerHTML=`<div class="banner">${ICON.phone}<div class="grow">${t("install")}</div>
    <button class="btn sm primary" data-act="install">${t("installBtn")}</button><button class="x" data-act="dismissInstall" aria-label="${t("dismiss")}">×</button></div>`;
  else if(isIOS())b.innerHTML=`<div class="banner">${ICON.phone}<div class="grow"><b>${t("install")}</b><div class="small">${t("installIos")}</div></div>
    <button class="x" data-act="dismissInstall" aria-label="${t("dismiss")}">×</button></div>`;
  else b.innerHTML="";
}

/* =================== views: auth & onboarding =================== */
const LOGO=`<img class="logo" src="icons/icon-192.png" alt="">`;
function viewAuth(){
  return `<div class="authwrap fadein"><div class="stack">
    ${LOGO}<h1>${t("app")}</h1><div class="muted" style="text-align:center">${t("tagline")}</div>
    <div class="card stack">
      <div class="seg"><button data-act="authIn" class="${authMode==="in"?"on":""}">${t("signIn")}</button><button data-act="authUp" class="${authMode==="up"?"on":""}">${t("signUp")}</button></div>
      <form id="authForm" class="stack" autocomplete="on">
        ${authMode==="up"?`<div><label class="f">${t("yourName")}</label><input type="text" dir="auto" id="aName" autocomplete="name" required></div>`:""}
        <div><label class="f">${t("email")}</label><input type="email" id="aEmail" autocomplete="email" inputmode="email" required></div>
        <div><label class="f">${t("password")}</label><input type="password" id="aPass" ${authMode==="up"?'minlength="6"':""} autocomplete="${authMode==="up"?"new-password":"current-password"}" required></div>
        ${authErr?`<div class="err">${esc(authErr)}</div>`:""}
        ${authMsg?`<div class="banner">${esc(authMsg)}</div>`:""}
        <button class="btn primary block" id="authGo">${authMode==="up"?t("signUp"):t("signIn")}</button>
      </form>
      ${authMode==="in"?`<button class="btn link block" data-act="forgot">${t("forgot")}</button>`:""}
    </div></div></div>`;
}
function viewOnboard(){
  const nm=(S.user&&S.user.user_metadata&&S.user.user_metadata.name)||"";
  return `<div class="stack fadein" style="padding-top:4vh">
    ${LOGO}<h1 style="text-align:center;margin:0;font-size:28px">${t("welcome")}</h1>
    <div class="muted" style="text-align:center">${t("hhIntro")}</div>
    <div class="card"><label class="f">${t("yourName")}</label><input type="text" dir="auto" id="oName" value="${esc(nm)}"></div>
    <form class="card stack" id="createHh"><h2 class="sec">${t("createHh")}</h2>
      <div><label class="f">${t("hhName")}</label><input type="text" dir="auto" id="oHh" placeholder="${lang==="he"?"הבית שלנו":"Home"}"></div>
      <button class="btn primary block">${t("create")}</button></form>
    <form class="card stack" id="joinHh"><h2 class="sec">${t("joinHh")}</h2>
      <div><label class="f">${t("inviteCode")}</label><input type="text" dir="auto" id="oCode" autocapitalize="characters" maxlength="6" style="text-transform:uppercase;letter-spacing:.2em;font-weight:600"></div>
      <button class="btn ghost block">${t("join")}</button></form>
    <button class="btn link block" data-act="signOut">${t("signOut")}</button>
  </div>`;
}

/* =================== views: recipes =================== */
function recipeCard(r){const ps=perServing(r);
  return `<div class="card rcard" data-open="${esc(r.id)}">
    <div class="avatar" style="background:${grad(r.name)}">${esc(initial(r.name))}</div>
    <div class="grow"><h3 dir="auto">${esc(r.name)}</h3>
      <div class="meta">${r.time?`<span>${ICON.clock}${esc(r.time)} ${t("min")}</span>`:""}<span>${ICON.people}${esc(r.servings||1)}</span>
        ${(r.ingredients||[]).length?`<span>${ICON.list}${r.ingredients.length}</span>`:""}</div>
      ${(r.tags||[]).length?`<div class="chips" style="margin-top:7px">${r.tags.slice(0,3).map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>`:""}
    </div>
    ${ps.kcal?`<div class="kpill">${r0(ps.kcal)}<small>${t("kcal")}</small></div>`:""}
  </div>`}
function viewList(){
  if(!S.loaded&&!S.recipes.length)return `<div class="empty">${t("loading")}</div>`;
  const q=norm(query);
  const allTags=[...new Set(S.recipes.flatMap(r=>r.tags||[]))].sort((a,b)=>a.localeCompare(b));
  const list=S.recipes.filter(r=>(!tagFilter||(r.tags||[]).includes(tagFilter))&&(!q||norm(r.name).includes(q)||norm((r.tags||[]).join(" ")).includes(q)
    ||(r.ingredients||[]).some(i=>norm(i.name).includes(q)))).sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  let h=`<div class="stack fadein"><div class="searchbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
    <input type="search" id="q" placeholder="${t("search")}" value="${esc(query)}"></div>`;
  h+=`<button class="aibtn" data-act="ai">${ICON.sparkle}<span class="grow"><b>${t("aiImport")}</b><small>${t("aiSub")}</small></span></button>
    <button class="aibtn ask" data-act="ask">${ICON.chat}<span class="grow"><b>${t("askAI")}</b><small>${t("askSub")}</small></span></button>`;
  if(allTags.length>1)h+=`<div class="chips">${allTags.map(x=>`<button class="chip ${tagFilter===x?"on":""}" data-act="tag" data-tag="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
  if(!S.recipes.length)h+=`<div class="card empty"><div class="em">🥗</div>${t("noRecipes")}</div>`;
  else if(!list.length)h+=`<div class="empty">${t("noMatch")}</div>`;
  return h+list.map(recipeCard).join("")+"</div>";
}
function bindList(){const q=$("#q");if(q){q.oninput=e=>{query=e.target.value;const pos=e.target.selectionStart;
  $("#view").innerHTML=viewList();bindList();const n=$("#q");n.focus();try{n.setSelectionRange(pos,pos)}catch(_){}}}}

function viewDetail(r){
  const ps=perServing(r),steps=(r.steps||[]).filter(s=>String(s).trim()),ings=r.ingredients||[];
  return `<div class="stack fadein">
  <div class="hero" style="background:${grad(r.name)}">
    <h1>${esc(r.name)}</h1>
    <div class="meta"><span>${ICON.people}${esc(r.servings||1)} ${t("servings").toLowerCase()}</span>${r.time?`<span>${ICON.clock}${esc(r.time)} ${t("min")}</span>`:""}</div>
    ${(r.tags||[]).length?`<div class="chips" style="margin-top:10px;position:relative;z-index:1">${r.tags.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>`:""}
  </div>
  <div class="card"><div class="macros">
    <div class="macro k"><b>${r0(ps.kcal)}</b><span>${t("kcal")}</span></div>
    <div class="macro p"><b>${r1(ps.protein)}</b><span>${t("protein")}</span></div>
    <div class="macro c"><b>${r1(ps.carbs)}</b><span>${t("carbs")}</span></div>
    <div class="macro f"><b>${r1(ps.fat)}</b><span>${t("fat")}</span></div></div>
    <div class="muted small" style="text-align:center;margin-top:10px">${t("perServing")}</div></div>
  <div class="grid2"><button class="btn primary" data-act="addToday">${ICON.plus}${t("addToday")}</button>
    <button class="btn ghost" data-act="toShop" ${ings.length?"":"disabled"}>${ICON.cart}${t("toShop")}</button></div>
  ${ings.length?`<div class="card"><h2 class="sec">${t("ingredients")}<span class="n">${ings.length}</span></h2><ul class="ing">
    ${ings.map(i=>`<li><span class="dot"></span><span class="grow">${esc(i.name)}</span><span class="muted"><bdi>${esc(i.amount||"")}</bdi></span>${num(i.kcal)?`<span class="small" style="color:var(--kcal);min-width:44px;text-align:end;font-weight:600">${r0(num(i.kcal))}</span>`:""}</li>`).join("")}
  </ul></div>`:""}
  ${steps.length?`<div class="card"><h2 class="sec">${t("steps")}</h2><ol class="steps">${steps.map(s=>`<li><span>${esc(s)}</span></li>`).join("")}</ol></div>`:""}
  ${r.notes?`<div class="card"><h2 class="sec">${t("notes")}</h2><div style="white-space:pre-wrap">${esc(r.notes)}</div></div>`:""}
  ${r.source?`<div class="small muted" style="text-align:center">${t("source")}: <a href="${esc(r.source)}" target="_blank" rel="noopener">${esc(String(r.source).replace(/^https?:\/\/(www\.)?/,"").slice(0,60))}</a></div>`:""}
  <button class="btn ghost block" data-act="translate" ${CLOUD?"":"disabled"}>${ICON.globe}${t("translateTo")}</button>
  <div class="grid2"><button class="btn ghost" data-act="edit">${t("edit")}</button>
    <button class="btn danger" data-act="del">${delArm===r.id?t("delAgain"):t("del")}</button></div>
  </div>`;
}
const rowFood=new WeakMap();
function ingRow(i={}){return `<div class="ingrow ${i.food?"auto":""}" data-ing='${esc(JSON.stringify({p:i.protein??null,c:i.carbs??null,f:i.fat??null,food:i.food||null}))}'>
  <input type="text" dir="auto" class="in-name" data-food placeholder="${t("ingName")}" value="${esc(i.name||"")}" autocomplete="off">
  <input type="text" dir="auto" class="in-amt" placeholder="${t("amount")}" value="${esc(i.amount||"")}">
  <input type="number" step="any" inputmode="decimal" class="in-kcal" placeholder="${t("kcal")}" value="${esc(i.kcal??"")}">
  <button class="x" type="button" data-act="rmIng" aria-label="remove">×</button></div>`}
function viewEdit(r){r=r||S.draft||{servings:1,ingredients:[{},{},{}],steps:[]};S.draft=null;
  return `<form id="editForm" class="stack fadein" autocomplete="off">
  <div class="card stack">
    <div><label class="f">${t("name")}</label><input type="text" dir="auto" name="rname" value="${esc(r.name||"")}" required></div>
    <div class="grid2">
      <div><label class="f">${t("servings")}</label><input type="number" step="any" inputmode="decimal" name="servings" min="1" value="${esc(r.servings||1)}"></div>
      <div><label class="f">${t("time")}</label><input type="number" step="any" inputmode="numeric" name="time" value="${esc(r.time??"")}"></div>
    </div></div>
  <div class="card"><h2 class="sec">${t("ingredients")}</h2>
    <div id="ings">${(r.ingredients&&r.ingredients.length?r.ingredients:[{}]).map(ingRow).join("")}</div>
    <button type="button" class="btn block" data-act="addIng">${t("addIng")}</button>
    <div class="muted small" style="margin-top:8px" id="ingSum"></div></div>
  <div class="card"><h2 class="sec">${t("kcalServing")}</h2>
    <input type="number" step="any" inputmode="decimal" name="kcalPerServing" value="${esc(r.kcalPerServing??"")}" id="kcalIn">
    <label class="f" style="margin-top:14px">${t("macrosServing")}</label>
    <div class="grid3">
      <input type="number" step="any" inputmode="decimal" name="protein" placeholder="${t("protein")}" value="${esc(r.protein??"")}">
      <input type="number" step="any" inputmode="decimal" name="carbs" placeholder="${t("carbs")}" value="${esc(r.carbs??"")}">
      <input type="number" step="any" inputmode="decimal" name="fat" placeholder="${t("fat")}" value="${esc(r.fat??"")}"></div></div>
  <div class="card"><h2 class="sec">${t("steps")} <span class="muted small" style="font-weight:400">· ${t("stepsHint")}</span></h2><textarea dir="auto" name="steps">${esc((r.steps||[]).join("\n"))}</textarea></div>
  <div class="card stack">
    <div><label class="f">${t("tags")}</label><input type="text" dir="auto" name="tags" value="${esc((r.tags||[]).join(", "))}"></div>
    <div><label class="f">${t("notes")}</label><textarea dir="auto" name="notes" style="min-height:70px">${esc(r.notes||"")}</textarea></div>
    <div><label class="f">${t("source")}</label><input type="url" name="source" value="${esc(r.source||"")}" placeholder="https://"></div></div>
  <div class="grid2"><button type="button" class="btn ghost" data-act="cancel">${t("cancel")}</button>
    <button type="submit" class="btn primary">${t("save")}</button></div>
  </form>`}
function rowState(row){if(!rowFood.has(row)){let d={};try{d=JSON.parse(row.dataset.ing||"{}")}catch(_){}rowFood.set(row,d)}return rowFood.get(row)}
function recalcRow(row){const st=rowState(row);if(!st.food)return;
  const n=foodNutrition(st.food,row.querySelector(".in-amt").value);
  if(n){row.querySelector(".in-kcal").value=n.kcal;st.p=n.protein;st.c=n.carbs;st.f=n.fat;row.classList.add("auto")}}
function closeSuggest(){document.querySelectorAll(".suggest").forEach(x=>x.remove())}
function showSuggest(input,list,onPick){closeSuggest();if(!list.length)return;
  input.insertAdjacentHTML("afterend",suggestHTML(list));const box=input.nextElementSibling;
  // keep the keyboard open while tapping, and act on "click" so the tap can't fall through to what's underneath
  box.addEventListener("pointerdown",e=>e.preventDefault());box.addEventListener("mousedown",e=>e.preventDefault());
  box.addEventListener("click",e=>{const b=e.target.closest("[data-sug]");if(!b)return;e.preventDefault();e.stopPropagation();closeSuggest();onPick(list[+b.dataset.sug])})}
function updIngSum(){const f=$("#editForm");if(!f)return;
  let s=0;f.querySelectorAll(".in-kcal").forEach(i=>s+=num(i.value));
  const sv=Math.max(1,num(f.servings.value)||1);
  $("#ingSum").textContent=s?`${t("total")}: ${r0(s)} ${t("kcal")} · ${r0(s/sv)} ${t("kcal")} ${t("perServing")}`:"";
  $("#kcalIn").placeholder=s?`${r0(s/sv)} — ${t("calcFromIng")}`:"";
  const tot={protein:0,carbs:0,fat:0},have={};
  f.querySelectorAll(".ingrow").forEach(row=>{const st=rowState(row);[["protein","p"],["carbs","c"],["fat","f"]].forEach(([k,a])=>{if(st[a]!=null){tot[k]+=num(st[a]);have[k]=1}})});
  ["protein","carbs","fat"].forEach(k=>{const el=f.elements.namedItem(k);if(el)el.placeholder=have[k]?String(r1(tot[k]/sv)):t(k)});
}

/* =================== views: today =================== */
function viewToday(){
  const es=S.log[curDate]||[];
  const tot=es.reduce((a,e)=>({kcal:a.kcal+num(e.kcal),protein:a.protein+num(e.protein),carbs:a.carbs+num(e.carbs),fat:a.fat+num(e.fat)}),{kcal:0,protein:0,carbs:0,fat:0});
  const goal=num(S.settings.goal)||2000,frac=Math.min(1,tot.kcal/goal),diff=goal-tot.kcal,C=2*Math.PI*56;
  const d=new Date(curDate+"T12:00:00");
  const label=d.toLocaleDateString(lang==="he"?"he-IL":"en-GB",{weekday:"long",day:"numeric",month:"long"});
  const isToday=curDate===dkey(new Date()),arrowL=lang==="he"?"›":"‹",arrowR=lang==="he"?"‹":"›";
  const mg=tot.protein+tot.carbs+tot.fat||1;
  const mline=(k,cls,val)=>`<div><div class="statline"><span class="muted">${t(k)}</span><b><bdi>${r0(val)} g</bdi></b></div><div class="mbar"><i style="width:${val/mg*100}%;background:var(--${cls})"></i></div></div>`;
  return `<div class="stack fadein">
  <div class="daynav"><button class="iconbtn" data-act="dayPrev" aria-label="${t("prev")}">${arrowL}</button>
    <div class="grow" style="text-align:center;font-weight:600">${esc(label)}</div>
    <button class="iconbtn" data-act="dayNext" aria-label="${t("next")}">${arrowR}</button></div>
  ${isToday?"":`<button class="btn block ghost" data-act="dayToday">${t("todayBtn")}</button>`}
  <div class="card"><div class="todayhero">
    <div class="ringwrap ${diff<0?"over":""}"><svg viewBox="0 0 132 132"><circle class="ring-bg" cx="66" cy="66" r="56" fill="none" stroke-width="12"/>
      <circle class="ring-fg" cx="66" cy="66" r="56" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-frac)}"/></svg>
      <div class="lbl"><b>${r0(tot.kcal)}</b><span>${t("kcal")} ${t("eaten")}</span></div></div>
    <div class="grow">
      <button class="btn ghost block" data-act="goal" style="flex-direction:column;gap:0;padding:10px">
        <span class="muted small" style="font-weight:500">${t("goal")}</span><span style="font-size:20px">${r0(goal)}</span></button>
      <div style="text-align:center;margin-top:10px;font-weight:600;color:${diff<0?"var(--warn)":"var(--accent)"}">${r0(Math.abs(diff))} ${t("kcal")} ${diff<0?t("over"):t("left")}</div>
    </div></div>
    <div class="stack" style="margin-top:16px">${mline("protein","p",tot.protein)}${mline("carbs","c",tot.carbs)}${mline("fat","f",tot.fat)}</div>
  </div>
  <div class="card">${es.length?es.map(e=>`<div class="entry"><div class="ic" style="background:${grad(e.name)}">${esc(initial(e.name))}</div>
      <div class="grow"><div style="font-weight:500">${esc(e.name)}</div>
      <div class="muted small">${e.servings&&e.servings!=1?esc(e.servings)+" × · ":""}${num(e.protein)?r0(num(e.protein))+"g "+t("protein").toLowerCase():""}</div></div>
      <b style="color:var(--kcal)">${r0(num(e.kcal))}</b>
      <button class="x" data-act="rmEntry" data-id="${esc(e.id)}" aria-label="remove">×</button></div>`).join("")
    :`<div class="empty" style="padding:22px"><div class="em">🍽️</div>${t("nothing")}</div>`}</div>
  </div>`;
}

/* =================== views: shopping =================== */
function shopRow(i){const pf=productFor(i.name);return `<div class="sitem ${i.done?"done":""}" data-shop="${esc(i.id)}">
  <div class="check">${ICON.check}</div>${pf?thumbHTML(pf,34):""}
  <div class="grow"><div class="nm">${esc(i.name)}</div>${(i.recipes||[]).length?`<span class="src">${esc(i.recipes.join(" · "))}</span>`:""}</div>
  ${i.amount?`<span class="amt"><bdi>${esc(i.amount)}</bdi></span>`:""}
  <button class="x" data-act="rmShop" data-id="${esc(i.id)}" aria-label="remove">×</button></div>`}
function viewShop(){
  const items=S.shop,open=items.filter(i=>!i.done),done=items.filter(i=>i.done),pct=items.length?done.length/items.length*100:0;
  return `<div class="stack fadein">
  <form class="addbar" id="shopForm" autocomplete="off"><div class="grow" style="position:relative"><input type="text" dir="auto" id="shopIn" data-food placeholder="${t("addItem")}" enterkeyhint="done" autocomplete="off"></div>
    <button class="btn primary" aria-label="${t("add")}">${ICON.plus}</button></form>
  <button class="btn ghost block" data-act="shopFromRecipe">${ICON.book}${t("fromRecipes")}</button>
  ${!items.length?`<div class="card empty"><div class="em">🛒</div><b>${t("shopEmpty")}</b><div class="small" style="margin-top:4px">${t("shopEmpty2")}</div></div>`:`
  <div class="card">
    <div class="row" style="margin-bottom:8px"><div class="grow small muted">${done.length} ${t("of")} ${items.length} ${t("bought")}</div>
      <button class="btn sm ghost" data-act="copyShop">${ICON.copy}${t("copy")}</button></div>
    <div class="progress"><i style="width:${pct}%"></i></div></div>
  ${open.length?`<div class="card"><h2 class="sec">${t("toBuy")}<span class="n">${open.length}</span></h2>${open.map(shopRow).join("")}</div>`:""}
  ${done.length?`<div class="card"><h2 class="sec">${t("inCart")}<span class="n">${done.length}</span></h2>${done.map(shopRow).join("")}</div>`:""}
  <div class="grid2"><button class="btn ghost" data-act="clearDone" ${done.length?"":"disabled"}>${t("clearDone")}</button>
    <button class="btn danger" data-act="clearAll">${clearArm?t("clearAgain"):t("clearAll")}</button></div>`}
  </div>`;
}
async function addShopItems(list){
  const updates=[],inserts=[];
  for(const it of list){
    const name=String(it.name||"").trim();if(!name)continue;
    const ex=S.shop.find(x=>!x.done&&norm(x.name)===norm(name))||inserts.find(x=>norm(x.name)===norm(name));
    if(ex){if(it.amount)ex.amount=ex.amount?ex.amount+" + "+it.amount:it.amount;
      if(it.recipeName&&!(ex.recipes||[]).includes(it.recipeName))ex.recipes=[...(ex.recipes||[]),it.recipeName];
      if(!inserts.includes(ex)&&!updates.includes(ex))updates.push(ex)}
    else inserts.push({id:uuid(),name,amount:it.amount||"",done:false,recipes:it.recipeName?[it.recipeName]:[],createdAt:new Date().toISOString()});
  }
  S.shop=[...S.shop,...inserts];saveCache();rerender();
  await write("shop",async()=>{
    for(const u of updates)await S.api.updateShop(u.id,{amount:u.amount,recipes:u.recipes});
    await S.api.insertShop(inserts);
  });
  return updates.length+inserts.length;
}
function setShopDone(id,done){S.shop=S.shop.map(i=>i.id===id?{...i,done}:i);saveCache();rerender();write("shop",()=>S.api.updateShop(id,{done}))}
function removeShop(ids){const s=new Set(ids);S.shop=S.shop.filter(i=>!s.has(i.id));saveCache();rerender();write("shop",()=>S.api.deleteShop(ids))}

/* =================== views: settings =================== */
function viewSettings(){
  const h=S.household||{},me=S.members.find(m=>S.user&&m.user_id===S.user.id);
  return `<div class="stack fadein">
  ${!CLOUD?`<div class="banner warn">${esc(t("demoNote"))}</div>`:""}
  ${CLOUD?`<div class="card stack"><h2 class="sec">${t("household")}</h2>
    <form class="row" id="hhRename"><input type="text" dir="auto" id="hhName" value="${esc(h.name||"")}"><button class="btn sm ghost">${t("rename")}</button></form>
    <div><label class="f">${t("invite")}</label><div class="code">${esc(h.invite_code||"——")}</div>
      <div class="muted small" style="margin-top:8px">${t("inviteHint")}</div></div>
    <div class="grid2"><button class="btn sm ghost" data-act="copyCode">${ICON.copy}${t("copyCode")}</button><button class="btn sm ghost" data-act="newCode">↻ ${t("newCode")}</button></div>
    ${S.members.length?`<div><label class="f">${t("members")}</label>${S.members.map(m=>`<div class="member"><div class="ic" style="background:${grad(m.display_name||"?")}">${esc(initial(m.display_name||"?"))}</div>
      <div class="grow">${esc(m.display_name||"—")}${S.user&&m.user_id===S.user.id?` <span class="muted small">(${t("you")})</span>`:""}</div></div>`).join("")}</div>`:""}
    <form class="row" id="hhJoin"><input type="text" dir="auto" id="joinCode" placeholder="${t("inviteCode")}" maxlength="6" style="text-transform:uppercase"><button class="btn sm ghost">${t("join")}</button></form>
    <div class="muted small">${t("switchHh")}</div>
  </div>`:""}
  <div class="card"><h2 class="sec">${t("settings")}</h2>
    <div class="setrow"><div class="grow">${t("setGoal")}</div><button class="btn sm ghost" data-act="goal">${r0(num(S.settings.goal)||2000)} ${t("kcal")}</button></div>
    <div class="setrow"><div class="grow">${t("language")}</div><div class="seg" style="width:160px"><button data-act="setLang" data-v="en" class="${lang==="en"?"on":""}">English</button><button data-act="setLang" data-v="he" class="${lang==="he"?"on":""}">עברית</button></div></div>
    <div class="setrow"><div class="grow">${t("theme")}</div><div class="seg" style="width:160px"><button data-act="setTheme" data-v="light" class="${theme==="light"?"on":""}">${t("light")}</button><button data-act="setTheme" data-v="dark" class="${theme==="dark"?"on":""}">${t("dark")}</button></div></div>
  </div>
  <div class="card stack"><h2 class="sec">${t("data")}</h2>
    <button class="btn ghost block" data-act="import">${ICON.upload}${t("importR")}</button>
    <button class="btn ghost block" data-act="export">${ICON.download}${t("exportR")}</button></div>
  ${CLOUD?`<div class="card stack"><h2 class="sec">${t("account")}</h2>
    ${me?`<form class="row" id="meRename"><input type="text" dir="auto" id="meName" value="${esc(me.display_name||"")}"><button class="btn sm ghost">${t("rename")}</button></form>`:""}
    <div class="muted small">${esc(S.user&&S.user.email||"")}</div>
    <button class="btn danger block" data-act="signOut">${t("signOut")}</button></div>`:""}
  <div class="muted small" style="text-align:center">${t("version")} ${VERSION}</div>
  </div>`;
}

/* =================== sheets =================== */
function openSheet(html,bind){$("#sheet").innerHTML=`<div class="grab"></div>`+html;$("#sheetBg").classList.add("on");bind&&bind()}
function closeSheet(){$("#sheetBg").classList.remove("on")}
$("#sheetBg").addEventListener("click",e=>{if(e.target.id==="sheetBg")closeSheet()});

async function addEntry(day,e){
  e={id:uuid(),day,...e};
  if(!S.log[day])S.log[day]=await S.api.listLog(day).catch(()=>[]);
  S.log[day]=[...S.log[day],e];rerender();
  await write("log",()=>S.api.addLog(e));
}
function sheetAddRecipe(r){
  const ps=perServing(r);
  openSheet(`<div class="stack"><h2 class="sec" style="font-size:19px">${esc(r.name)}</h2>
    <label class="f">${t("servings")}</label>
    <div class="row"><button class="iconbtn" id="sm">−</button><input type="number" step="any" inputmode="decimal" id="sv" value="1" step="0.5" style="text-align:center;font-size:20px;font-weight:600">
      <button class="iconbtn" id="sp">+</button></div>
    <div id="svk" style="text-align:center;font-size:22px;font-weight:700;color:var(--kcal)"></div>
    <div class="grid2"><button class="btn ghost" id="sc">${t("cancel")}</button><button class="btn primary" id="sa">${t("add")}</button></div></div>`,()=>{
    const sv=$("#sv"),upd=()=>$("#svk").textContent=r0(ps.kcal*num(sv.value))+" "+t("kcal");upd();
    sv.oninput=upd;$("#sm").onclick=()=>{sv.value=Math.max(.5,num(sv.value)-.5);upd()};$("#sp").onclick=()=>{sv.value=num(sv.value)+.5;upd()};
    $("#sc").onclick=closeSheet;
    $("#sa").onclick=()=>{const n=num(sv.value)||1;closeSheet();
      addEntry(dkey(new Date()),{recipeId:r.id,name:r.name,servings:n,kcal:r1(ps.kcal*n),protein:r1(ps.protein*n),carbs:r1(ps.carbs*n),fat:r1(ps.fat*n)});
      toast(t("added")+" · "+t("today"))};
  });
}
function sheetShopIngs(r){
  const ings=(r.ingredients||[]).filter(i=>i.name);
  if(!ings.length){toast(t("noIngs"));return}
  const sel=ings.map(()=>true);
  const draw=()=>{$("#pick").innerHTML=ings.map((i,k)=>`<div class="pickrow ${sel[k]?"":"off"}" data-k="${k}"><div class="check">${ICON.check}</div>
      <div class="grow">${esc(i.name)}</div><span class="muted small"><bdi>${esc(i.amount||"")}</bdi></span></div>`).join("");
    const n=sel.filter(Boolean).length;$("#pa").textContent=`${t("add")} (${n})`;$("#pa").disabled=!n};
  openSheet(`<div class="stack"><div class="row"><h2 class="sec grow" style="font-size:19px;margin:0">${t("chooseIng")}</h2>
      <button class="btn sm ghost" id="pAll">${t("selectAll")}</button><button class="btn sm ghost" id="pNone">${t("selectNone")}</button></div>
    <div class="muted small" style="margin-top:4px">${esc(r.name)}</div>
    <div id="pick"></div>
    <div class="grid2"><button class="btn ghost" id="pc">${t("cancel")}</button><button class="btn primary" id="pa"></button></div></div>`,()=>{
    draw();
    $("#pick").onclick=e=>{const row=e.target.closest("[data-k]");if(!row)return;sel[+row.dataset.k]=!sel[+row.dataset.k];draw()};
    $("#pAll").onclick=()=>{sel.fill(true);draw()};$("#pNone").onclick=()=>{sel.fill(false);draw()};
    $("#pc").onclick=closeSheet;
    $("#pa").onclick=async()=>{const list=ings.filter((_,k)=>sel[k]).map(i=>({name:i.name,amount:i.amount,recipeName:r.name}));
      closeSheet();const n=await addShopItems(list);toast(`${n} ${t("itemsAdded")}`)};
  });
}
function sheetPickRecipe(){
  const opts=[...S.recipes].filter(r=>(r.ingredients||[]).length).sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  openSheet(`<div class="stack"><h2 class="sec" style="font-size:19px">${t("pickRecipe")}</h2>
    ${opts.length?opts.map(r=>`<div class="pickrow" data-rid="${esc(r.id)}"><div class="avatar" style="width:40px;height:40px;font-size:17px;border-radius:12px;background:${grad(r.name)}">${esc(initial(r.name))}</div>
      <div class="grow">${esc(r.name)}</div><span class="muted small">${r.ingredients.length} ${t("ingredients").toLowerCase()}</span></div>`).join("")
      :`<div class="empty">${t("noRecipes")}</div>`}
    <button class="btn ghost block" id="prc">${t("cancel")}</button></div>`,()=>{
    $("#prc").onclick=closeSheet;
    $("#sheet").querySelectorAll("[data-rid]").forEach(el=>el.onclick=()=>{const r=S.recipes.find(x=>x.id===el.dataset.rid);if(r)sheetShopIngs(r)});
  });
}
function sheetQuick(){
  const opts=[...S.recipes].sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  openSheet(`<form class="stack" id="qf"><h2 class="sec" style="font-size:19px">${t("quickAdd")}</h2>
    ${opts.length?`<div><label class="f">${t("fromRecipe")}</label><select id="qr"><option value="">—</option>${opts.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join("")}</select></div>`:""}
    <div style="position:relative"><label class="f">${t("whatAte")}</label><input type="text" dir="auto" id="qn" data-food autocomplete="off" placeholder="${t("searchProducts")}"></div>
    <div><label class="f">${t("amount")}</label><input type="text" dir="auto" id="qa" placeholder="${t("amountHint")}"></div>
    <div class="grid2"><div><label class="f">${t("kcal")}</label><input type="number" step="any" inputmode="decimal" id="qk"></div>
      <div><label class="f">${t("protein")} (g)</label><input type="number" step="any" inputmode="decimal" id="qp"></div></div>
    <div class="grid2"><button type="button" class="btn ghost" id="qc">${t("cancel")}</button><button class="btn primary">${t("add")}</button></div></form>`,()=>{
    $("#qc").onclick=closeSheet;
    let qfood=null,qmac={c:0,f:0};
    const qcalc=()=>{if(!qfood)return;const n=foodNutrition(qfood,$("#qa").value);if(n){$("#qk").value=n.kcal;$("#qp").value=n.protein;qmac={c:n.carbs,f:n.fat}}};
    $("#qn").addEventListener("input",()=>{qfood=null});
    $("#qn").addEventListener("foodpick",e=>{const food=e.detail;qfood=foodSnap(food);$("#qn").value=food.name;
      if(!$("#qa").value.trim())$("#qa").value=defaultAmount(food);qcalc();$("#qa").focus()});
    $("#qa").oninput=qcalc;
    const qr=$("#qr");if(qr)qr.onchange=()=>{const r=S.recipes.find(x=>x.id===qr.value);if(r){qfood=null;const ps=perServing(r);$("#qn").value=r.name;$("#qa").value="1";$("#qk").value=r0(ps.kcal);$("#qp").value=r1(ps.protein);qmac={c:r1(ps.carbs),f:r1(ps.fat)}}};
    $("#qa").addEventListener("input",()=>{const r=qr&&qr.value?S.recipes.find(x=>x.id===qr.value):null;if(r&&$("#qn").value===r.name){const ps=perServing(r),n=num($("#qa").value)||1;
      $("#qk").value=r0(ps.kcal*n);$("#qp").value=r1(ps.protein*n)}});
    $("#qf").onsubmit=ev=>{ev.preventDefault();const name=$("#qn").value.trim();if(!name){toast(t("needName"));return}
      const r=qr&&qr.value?S.recipes.find(x=>x.id===qr.value):null,ps=r?perServing(r):null,same=ps&&r.name===name;
      const servings=r&&same?(num($("#qa").value)||1):1;
      closeSheet();addEntry(curDate,{recipeId:r?r.id:null,name:qfood&&$("#qa").value.trim()?`${name} (${$("#qa").value.trim()})`:name,servings,kcal:num($("#qk").value),protein:num($("#qp").value),
        carbs:same?r1(ps.carbs*servings):qmac.c,fat:same?r1(ps.fat*servings):qmac.f});toast(t("added"))};
  });
}
function sheetGoal(){
  openSheet(`<form class="stack" id="gf"><h2 class="sec" style="font-size:19px">${t("setGoal")}</h2>
    <input type="number" step="any" inputmode="numeric" id="gv" value="${esc(S.settings.goal||2000)}" style="font-size:22px;font-weight:600;text-align:center">
    <div class="grid2"><button type="button" class="btn ghost" id="gc">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div></form>`,()=>{
    $("#gc").onclick=closeSheet;
    $("#gf").onsubmit=ev=>{ev.preventDefault();const goal=num($("#gv").value)||2000;S.settings={...S.settings,goal};closeSheet();rerender();
      safe(async()=>{await S.api.saveSettings({goal});toast(t("saved"))})};
  });
}
function sheetNewPassword(){
  openSheet(`<form class="stack" id="npf"><h2 class="sec" style="font-size:19px">${t("setPassword")}</h2>
    <input type="password" id="np" minlength="6" placeholder="${t("newPassword")}" autocomplete="new-password" required>
    <button class="btn primary block">${t("save")}</button></form>`,()=>{
    $("#npf").onsubmit=ev=>{ev.preventDefault();safe(async()=>{const {error}=await SupaBackend.sb.auth.updateUser({password:$("#np").value});if(error)throw error;closeSheet();toast(t("pwChanged"))})};
  });
}
/* =================== products =================== */
let pq="",offHTML="";
function prodCard(p,extra=""){return `<div class="pcard" ${p.mine?`data-act="openProd" data-id="${esc(p.id)}"`:""}>${thumbHTML(p,48)}
  <div class="grow"><div class="pname" dir="auto">${esc(p.name)}${p.brand?` <span class="muted small">· ${esc(p.brand)}</span>`:""}</div>
    <div class="pmac"><span class="kc">${r0(num(p.kcal))} ${t("kcal")}</span><span>${t("protein")[0]} ${r1(num(p.protein))}</span><span>${t("carbs")[0]} ${r1(num(p.carbs))}</span><span>${t("fat")[0]} ${r1(num(p.fat))}</span>
    <span class="muted">/ 100${p.unit==="ml"?"ml":"g"}</span></div></div>${extra}</div>`}
function viewProducts(){
  const q=norm(pq);
  const mine=S.products.map(p=>({...p,mine:true})).filter(p=>!q||norm(p.name).includes(q)||norm(p.brand).includes(q)||String(p.barcode||"").includes(q))
    .sort((a,b)=>a.name.localeCompare(b.name));
  const common=q?searchFoods(q,12,{mine:false}):[];
  return `<div class="stack fadein">
  <div class="searchbox">${ICON.search}<input type="search" id="pq" placeholder="${t("searchProducts")}" value="${esc(pq)}" dir="auto"></div>
  <div class="grid2"><button class="btn primary" data-act="prodPhoto">${ICON.camera}${t("fromPhoto").replace(" (AI)","")}</button>
    <button class="btn ghost" data-act="offSearch" ${q.length>1?"":"disabled"}>${ICON.globe}${t("searchOnline")}</button></div>
  <div id="offRes">${offHTML}</div>
  <div class="card"><h2 class="sec">${t("myProducts")}<span class="n">${S.products.length}</span></h2>
    ${mine.length?mine.map(p=>prodCard(p)).join(""):`<div class="muted small" style="padding:6px 0">${q?t("notFound"):t("noProducts")}</div>`}</div>
  ${q?`<div class="card"><h2 class="sec">${t("commonFoods")}</h2>${common.length?common.map(f=>prodCard(f,`<button class="btn sm ghost" data-act="saveCommon" data-id="${f.id}" aria-label="${t("saveToMine")}">${ICON.plus}</button>`)).join(""):`<div class="muted small">${t("notFound")}</div>`}</div>`
     :`<div class="muted small" style="text-align:center">${t("commonHint").replace("{n}",commonFoods().length)}</div>`}
  </div>`;
}
document.addEventListener("input",e=>{if(e.target.id==="pq"){pq=e.target.value;window.__offRes=null;offHTML="";render()}});
async function offSearchUI(){
  const box=$("#offRes");if(!box||norm(pq).length<2)return;
  box.innerHTML=offHTML=`<div class="card"><span class="spin"></span>${t("searching")}</div>`;
  try{const isCode=/^\d{8,14}$/.test(pq.trim());
    const res=await S.api.callFn({mode:isCode?"off_barcode":"off_search",q:pq.trim(),code:pq.trim(),lang});
    const list=(res&&res.products)||[];window.__offRes=list;
    offHTML=`<div class="card"><h2 class="sec">${t("onlineRes")}<span class="n">${list.length}</span></h2>
      ${list.length?list.map((f,i)=>prodCard(f,`<button class="btn sm ghost" data-act="saveOff" data-i="${i}" aria-label="${t("saveToMine")}">${ICON.plus}</button>`)).join("")
        +`<div class="muted small" style="margin-top:8px">${t("offNote")}</div>`:`<div class="muted small">${t("notFound")}</div>`}</div>`;
    const b2=$("#offRes");if(b2)b2.innerHTML=offHTML;
  }catch(e){offHTML="";box.innerHTML=`<div class="banner warn">${esc(e.code==="demo"?t("needOnline"):e.code==="setup"?t("aiSetup"):errMsg(e))}</div>`}
}
async function saveFoodToMine(f){
  const p={id:uuid(),name:f.name,brand:f.brand||"",barcode:f.barcode||"",category:f.category||"",unit:f.unit||"g",serving_g:f.serving_g||null,
    serving_name:f.serving_name||"",kcal:numOrNull(f.kcal),protein:numOrNull(f.protein),carbs:numOrNull(f.carbs),fat:numOrNull(f.fat),
    sugar:numOrNull(f.sugar),fiber:numOrNull(f.fiber),source:f.source||(f.common?"common":"manual"),image:f.image||(f.common?commonImage(f):"")||""};
  S.products=[...S.products,p];saveCache();rerender();
  const ok=await write("products",()=>S.api.saveProduct(p));if(ok)toast(t("savedToMine"));
}
function sheetProduct(p,opt={}){
  const isNew=!p;p=p||{unit:"g"};const shots=[];let busy=false,armDel=false;
  const fld=(id,label,val,type="number")=>`<div><label class="f">${label}</label><input type="${type}" ${type==="number"?'inputmode="decimal" step="any"':'dir="auto"'} id="${id}" value="${esc(val??"")}"></div>`;
  openSheet(`<form class="stack" id="pf" autocomplete="off">
    <h2 class="sec" style="font-size:19px;margin:0">${isNew?t("addProduct"):t("editProduct")}</h2>
    ${CLOUD?`<div class="card stack" style="padding:12px;background:var(--bg)">
      <div class="row"><span class="aiic">${ICON.camera}</span><div class="grow"><b>${t("fromPhoto")}</b><div class="muted small">${t("fromPhotoHint")}</div></div></div>
      <div class="thumbs" id="pThumbs"></div>
      <div class="grid2"><label class="btn ghost" style="cursor:pointer">${ICON.image}${t("aiAddShots").split(" ")[0]}<input type="file" id="pFile" accept="image/*" multiple class="hidden"></label>
        <button type="button" class="btn primary" id="pAI">${ICON.sparkle}AI</button></div>
      <div id="pMsg"></div></div>`:""}
    <div class="row" id="picRow">${`<span id="picBox">${thumbHTML(p,72)}</span>`}<div class="grow">
      <label class="f">${t("picture")}</label>
      <div class="row" style="gap:6px;flex-wrap:wrap"><label class="btn sm ghost" style="cursor:pointer">${ICON.camera}<span id="picLbl">${p.image?t("changePicture"):t("addPicture")}</span><input type="file" id="picFile" accept="image/*" class="hidden"></label>
      <button type="button" class="btn sm ghost" id="picFind">${ICON.search}${t("findPicture")}</button>
      <button type="button" class="btn sm ghost ${p.image?"":"hidden"}" id="picDel">${t("removePicture")}</button></div></div></div>
    <div id="picPick"></div>
    ${fld("pName",t("name"),p.name,"text")}
    <div class="grid2">${fld("pBrand",t("brand"),p.brand,"text")}
      <div><label class="f">${t("barcode")}</label><div class="row" style="gap:6px"><input type="text" inputmode="numeric" id="pCode" value="${esc(p.barcode||"")}">
        ${CLOUD?`<button type="button" class="btn sm ghost" id="pLook">${ICON.search}</button>`:""}</div></div></div>
    <div class="row"><div class="grow"><label class="f">${t("unit")}</label><div class="seg" id="pUnit"><button type="button" data-u="g" class="${p.unit!=="ml"?"on":""}">g</button><button type="button" data-u="ml" class="${p.unit==="ml"?"on":""}">ml</button></div></div></div>
    <div class="grid2">${fld("pSg",t("servingSize")+" (g/ml)",p.serving_g)}${fld("pSn",t("servingName"),p.serving_name,"text")}</div>
    <label class="f" style="margin-bottom:-4px">${t("per100")} <span id="pU">${p.unit==="ml"?"ml":"g"}</span></label>
    <div class="grid3">${fld("pK",t("kcal"),p.kcal)}${fld("pP",t("protein"),p.protein)}${fld("pC",t("carbs"),p.carbs)}</div>
    <div class="grid3">${fld("pF",t("fat"),p.fat)}${fld("pSu",t("sugar"),p.sugar)}${fld("pFi",t("fiber"),p.fiber)}</div>
    <div class="grid2"><button type="button" class="btn ghost" id="pc">${t("cancel")}</button><button class="btn primary">${t("save")}</button></div>
    ${!isNew?`<button type="button" class="btn danger block" id="pDel">${t("del")}</button>`:""}
  </form>`,()=>{
    let unit=p.unit==="ml"?"ml":"g";
    let image=p.image||"",picBlob=null;                  // picBlob = new photo waiting to be uploaded on Save
    const showPic=()=>{$("#picBox").innerHTML=thumbHTML({name:$("#pName").value||p.name,image},72);$("#picLbl").textContent=image?t("changePicture"):t("addPicture");$("#picDel").classList.toggle("hidden",!image)};
    const setPicFrom=async file=>{try{const sm=await shrinkImage(file,480);picBlob=await (await fetch(sm.preview)).blob();image=sm.preview;showPic()}catch(_){}};
    $("#picFile").onchange=e=>{const f=e.target.files[0];e.target.value="";if(f)setPicFrom(f)};
    $("#picDel").onclick=()=>{image="";picBlob=null;showPic()};
    $("#picFind").onclick=async()=>{const name=$("#pName").value.trim()||p.name||"";if(!name){toast(t("needName"));return}
      const box=$("#picPick");box.innerHTML=`<div class="muted small"><span class="spin"></span>${t("searching")}</div>`;
      const brand=$("#pBrand").value.trim(),code=$("#pCode").value.replace(/\D/g,""),clean=cleanFoodName(name);
      const jobs=[wikiSearch(clean,lang==="he"?"he":"en",6),wikiSearch(clean,lang==="he"?"en":"he",4)];
      if(CLOUD){jobs.unshift(S.api.callFn({mode:"off_search",q:(brand?brand+" ":"")+name,lang}).then(r=>(r.products||[]).filter(x=>x.image).map(x=>({url:x.image,title:x.name,src:"Open Food Facts"}))).catch(()=>[]));
        if(code)jobs.unshift(S.api.callFn({mode:"off_barcode",code,lang}).then(r=>(r.products||[]).filter(x=>x.image).map(x=>({url:x.image,title:x.name,src:"Open Food Facts"}))).catch(()=>[]))}
      const seen=new Set(),all=(await Promise.all(jobs)).flat().filter(x=>!seen.has(x.url)&&seen.add(x.url)).slice(0,12);
      if(!$("#picPick"))return;
      box.innerHTML=all.length?`<label class="f" style="margin-top:6px">${t("choosePicture")}</label><div class="picgrid">${all.map((x,i)=>`<button type="button" data-pi="${i}" title="${esc(x.title)}"><img src="${esc(x.url)}" alt="" loading="lazy" onerror="this.parentNode.remove()"></button>`).join("")}</div>
        <div class="muted small" style="margin-top:4px">${t("picSources")}</div>`:`<div class="banner warn">${esc(t("noPictures"))}</div>`;
      box.onclick=e=>{const b=e.target.closest("[data-pi]");if(!b)return;image=all[+b.dataset.pi].url;picBlob=null;showPic();box.innerHTML=""}};
    $("#pUnit").onclick=e=>{const b=e.target.closest("[data-u]");if(!b)return;unit=b.dataset.u;$("#pUnit").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));$("#pU").textContent=unit};
    const fill=x=>{const set=(id,v)=>{if(v!=null&&v!=="")$("#"+id).value=v};
      if(x.image&&!image){image=x.image;picBlob=null;setTimeout(showPic)}
      set("pName",x.name);set("pBrand",x.brand);set("pCode",x.barcode);set("pSg",x.serving_g);set("pSn",x.serving_name);
      set("pK",x.kcal);set("pP",x.protein);set("pC",x.carbs);set("pF",x.fat);set("pSu",x.sugar);set("pFi",x.fiber);
      if(x.unit){unit=x.unit;$("#pUnit").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.u===unit));$("#pU").textContent=unit}};
    const msg=(h,c="")=>{const m=$("#pMsg");if(m)m.innerHTML=h?`<div class="banner ${c}" style="margin-top:8px">${h}</div>`:""};
    if(CLOUD){
      const draw=()=>{$("#pThumbs").innerHTML=shots.map((s,i)=>`<div class="thumb"><img src="${s.preview}" alt=""><button type="button" class="x" data-rm="${i}">×</button></div>`).join("")};
      $("#pThumbs").onclick=e=>{const b=e.target.closest("[data-rm]");if(b){shots.splice(+b.dataset.rm,1);draw()}};
      const runAI=async()=>{if(busy)return;if(!shots.length){msg(esc(t("needPhoto")),"warn");return}
        busy=true;$("#pAI").disabled=true;msg(`<span class="spin"></span>${esc(t("reading"))}`);
        try{const res=await S.api.callFn({mode:"product",lang,images:shots.map(({mime,data})=>({mime,data}))});
          fill(res.product);p.source="ai";msg(res.product.estimated?esc(t("estimated")):"",res.product.estimated?"warn":"")}
        catch(e){msg(esc(e.code==="setup"?t("aiSetup"):errMsg(e)),"warn")}finally{busy=false;const b=$("#pAI");if(b)b.disabled=false}};
      $("#pFile").onchange=async e=>{const files=[...e.target.files].slice(0,3-shots.length);
        if(files[0]&&!image)setPicFrom(files[0]);                       // first photo becomes the product picture
        for(const f of files){try{shots.push(await shrinkImage(f))}catch(_){}}e.target.value="";draw();if(shots.length)runAI()};
      $("#pAI").onclick=runAI;
      $("#pLook").onclick=async()=>{const code=$("#pCode").value.replace(/\D/g,"");if(!code)return;msg(`<span class="spin"></span>${esc(t("searching"))}`);
        try{const res=await S.api.callFn({mode:"off_barcode",code,lang});const f=(res.products||[])[0];
          if(f){fill(f);p.source="openfoodfacts";msg(esc(t("offNote")))}else msg(esc(t("notFound")),"warn")}catch(e){msg(esc(errMsg(e)),"warn")}};
      if(opt.photo)setTimeout(()=>$("#pFile").click(),50);
    }
    $("#pc").onclick=closeSheet;
    if($("#pDel"))$("#pDel").onclick=()=>{if(!armDel){armDel=true;$("#pDel").textContent=t("delAgain");return}
      closeSheet();S.products=S.products.filter(x=>x.id!==p.id);saveCache();rerender();write("products",()=>S.api.deleteProduct(p.id)).then(ok=>ok&&toast(t("deleted")))};
    $("#pf").onsubmit=ev=>{ev.preventDefault();const name=$("#pName").value.trim();if(!name){toast(t("needName"));return}
      const v=id=>numOrNull($("#"+id).value);
      const rec={id:p.id||uuid(),name,brand:$("#pBrand").value.trim(),barcode:$("#pCode").value.replace(/\D/g,""),category:p.category||"",unit,
        serving_g:v("pSg"),serving_name:$("#pSn").value.trim(),kcal:v("pK"),protein:v("pP"),carbs:v("pC"),fat:v("pF"),sugar:v("pSu"),fiber:v("pFi"),source:p.source||"manual",
        image:picBlob?image:image};
      const i=S.products.findIndex(x=>x.id===rec.id);if(i>=0)S.products[i]=rec;else S.products.push(rec);closeSheet();rerender();
      const blob=picBlob;let warn="";
      write("products",async()=>{
        if(blob){try{rec.image=await S.api.uploadImage(blob,rec.id)}catch(e){rec.image=(p.image||"");warn=t("picFail")+errMsg(e)}}
        S.api.warn="";await S.api.saveProduct(rec);if(S.api.warn){warn=S.api.warn;rec.image=""}
        const k=S.products.findIndex(x=>x.id===rec.id);if(k>=0)S.products[k]={...rec};saveCache();rerender();
      }).then(ok=>{if(ok){if(warn){toast(warn);clearTimeout(toast._t);toast._t=setTimeout(()=>$("#toast").classList.remove("on"),6000)}else toast(t("saved"))}})};
  });
}
/* translate a recipe into the app language */
async function translateRecipe(r,btn){
  btn.disabled=true;const old=btn.innerHTML;btn.innerHTML=`<span class="spin"></span>${t("translating")}`;
  try{const res=await S.api.callFn({mode:"translate",lang,recipe:{name:r.name,ingredients:r.ingredients,steps:r.steps,notes:r.notes,tags:r.tags}});
    const tr=res.recipe||{};
    const rec={...r,name:tr.name||r.name,notes:tr.notes??r.notes,tags:tr.tags||r.tags,steps:tr.steps||r.steps,
      ingredients:(r.ingredients||[]).map((i,k)=>({...i,name:(tr.ingredients&&tr.ingredients[k]&&tr.ingredients[k].name)||i.name,amount:(tr.ingredients&&tr.ingredients[k]&&tr.ingredients[k].amount!=null)?tr.ingredients[k].amount:i.amount}))};
    const i=S.recipes.findIndex(x=>x.id===r.id);if(i>=0)S.recipes[i]=rec;saveCache();rerender();
    const ok=await write("recipes",()=>S.api.saveRecipe(rec));if(ok)toast(t("translated"));
  }catch(e){toast(e.code==="setup"?t("aiSetup"):errMsg(e));btn.disabled=false;btn.innerHTML=old}
}

/* =================== video (screen recording) -> frames + soundtrack =================== */
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
async function videoFrames(file,max=10){
  const url=URL.createObjectURL(file);const v=document.createElement("video");
  v.muted=true;v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";v.src=url;
  try{
    await new Promise((ok,bad)=>{v.onloadedmetadata=ok;v.onerror=()=>bad(new Error("video"));setTimeout(()=>bad(new Error("timeout")),15000)});
    try{await v.play();v.pause()}catch(_){}
    let dur=v.duration;if(!isFinite(dur)||dur<=0)dur=30;
    const n=Math.max(3,Math.min(max,Math.round(dur/5)));const out=[];
    const w=Math.min(720,v.videoWidth||720),h=Math.round((v.videoHeight||1280)*(w/(v.videoWidth||720)));
    const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d");
    for(let i=0;i<n;i++){
      const tt=Math.min(dur-0.2,0.6+(dur-1)*(i/(n-1||1)));
      await new Promise(ok=>{let done=false;const fin=()=>{if(!done){done=true;ok()}};v.onseeked=fin;setTimeout(fin,3000);v.currentTime=Math.max(0,tt)});
      await wait(60);ctx.drawImage(v,0,0,w,h);const d=c.toDataURL("image/jpeg",0.72);out.push({mime:"image/jpeg",data:d.split(",")[1],preview:d});
    }
    return {frames:out,duration:dur};
  }finally{URL.revokeObjectURL(url)}
}
async function videoAudio(file,maxSec=120,rate=12000){
  if(file.size>250e6)return null;
  const AC=window.AudioContext||window.webkitAudioContext,OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!AC||!OAC)return null;
  const ctx=new AC();
  try{const buf=await file.arrayBuffer();
    const dec=await new Promise((ok,bad)=>{const p=ctx.decodeAudioData(buf,ok,bad);if(p&&p.then)p.then(ok,bad)});
    const len=Math.ceil(Math.min(dec.duration,maxSec)*rate);if(len<rate)return null;
    const off=new OAC(1,len,rate);const src=off.createBufferSource();src.buffer=dec;src.connect(off.destination);src.start(0);
    const out=await off.startRendering();const ch=out.getChannelData(0);
    let peak=0;for(let i=0;i<ch.length;i+=50)peak=Math.max(peak,Math.abs(ch[i]));if(peak<0.01)return null;
    const bytes=new Uint8Array(44+ch.length*2),dv=new DataView(bytes.buffer),wr=(o,s)=>{for(let i=0;i<s.length;i++)bytes[o+i]=s.charCodeAt(i)};
    wr(0,"RIFF");dv.setUint32(4,36+ch.length*2,true);wr(8,"WAVE");wr(12,"fmt ");dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);
    dv.setUint32(24,rate,true);dv.setUint32(28,rate*2,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);wr(36,"data");dv.setUint32(40,ch.length*2,true);
    for(let i=0;i<ch.length;i++){const x=Math.max(-1,Math.min(1,ch[i]/Math.max(peak,0.3)));dv.setInt16(44+i*2,x<0?x*0x8000:x*0x7fff,true)}
    let bin="";for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));
    return {mime:"audio/wav",data:btoa(bin)};
  }catch(_){return null}finally{try{ctx.close()}catch(_){}}
}

/* =================== ask AI for recipe ideas =================== */
let askState={q:"",count:3,results:null};
function askCard(r,i){const ps=perServing(r);return `<div class="askcard" data-i="${i}">
  <div class="row" style="align-items:flex-start"><div class="avatar" style="width:46px;height:46px;font-size:20px;border-radius:14px;background:${grad(r.name)}">${esc(initial(r.name))}</div>
    <div class="grow"><b dir="auto">${esc(r.name)}</b>${r.summary?`<div class="muted small" dir="auto">${esc(r.summary)}</div>`:""}
      <div class="meta" style="margin-top:4px">${r.time?`<span>${ICON.clock}${esc(r.time)} ${t("min")}</span>`:""}<span>${ICON.people}${esc(r.servings||1)}</span>
        ${ps.kcal?`<span style="color:var(--kcal);font-weight:600">${r0(ps.kcal)} ${t("kcal")} ${t("perServ")}</span>`:""}${ps.protein?`<span>${t("protein")} ${r0(ps.protein)}g</span>`:""}</div></div></div>
  <details><summary>${t("showMore")}</summary>
    <ul class="ing">${(r.ingredients||[]).map(x=>`<li><span class="dot"></span><span class="grow" dir="auto">${esc(x.name)}</span><span class="muted"><bdi>${esc(x.amount||"")}</bdi></span></li>`).join("")}</ul>
    <ol class="steps">${(r.steps||[]).map(x=>`<li><span dir="auto">${esc(x)}</span></li>`).join("")}</ol>
    ${r.notes?`<div class="muted small" dir="auto" style="margin-top:6px">💡 ${esc(r.notes)}</div>`:""}</details>
  <div class="grid2" style="margin-top:10px"><button type="button" class="btn sm ghost" data-ask="edit" data-i="${i}">${t("editFirst")}</button>
    <button type="button" class="btn sm primary" data-ask="add" data-i="${i}" ${r._added?"disabled":""}>${r._added?t("added2"):ICON.plus+t("addRecipe")}</button></div></div>`}
function sheetAsk(){
  if(!CLOUD){toast(t("aiDemo"));return}
  let busy=false;
  const exs=[t("askEx1"),t("askEx2"),t("askEx3"),t("askEx4")];
  openSheet(`<form class="stack" id="askf" autocomplete="off">
    <div class="row"><span class="aiic ask">${ICON.chat}</span><h2 class="sec grow" style="font-size:19px;margin:0">${t("askAI")}</h2></div>
    <textarea dir="auto" id="askQ" style="min-height:64px" placeholder="${t("askPlaceholder")}">${esc(askState.q)}</textarea>
    <div class="chips">${exs.map(x=>`<button type="button" class="chip" data-ex="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <div class="row"><span class="muted small grow">${t("askVariants")}</span><div class="seg" style="width:150px" id="askN">${[1,2,3].map(n=>`<button type="button" data-n="${n}" class="${askState.count===n?"on":""}">${n}</button>`).join("")}</div></div>
    <button class="btn primary block" id="askGo">${ICON.sparkle}${t("askGo")}</button>
    <div id="askMsg"></div><div id="askRes" class="stack"></div>
    <button type="button" class="btn ghost block" id="askClose">${t("cancel")}</button>
  </form>`,()=>{
    const res=$("#askRes"),msg=(h,c="")=>$("#askMsg").innerHTML=h?`<div class="banner ${c}">${h}</div>`:"";
    const draw=()=>{res.innerHTML=askState.results?askState.results.map(askCard).join(""):""};draw();
    $("#askClose").onclick=()=>{if(!busy)closeSheet()};
    $("#askN").onclick=e=>{const b=e.target.closest("[data-n]");if(!b)return;askState.count=+b.dataset.n;$("#askN").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b))};
    $("#askf").querySelector(".chips").onclick=e=>{const b=e.target.closest("[data-ex]");if(b){$("#askQ").value=b.dataset.ex;$("#askQ").focus()}};
    res.onclick=async e=>{const b=e.target.closest("[data-ask]");if(!b)return;const r=askState.results[+b.dataset.i];if(!r)return;
      const rec=normalizeRecipe({...r,source:""});rec.id=uuid();
      if(b.dataset.ask==="edit"){S.draft=rec;closeSheet();$("#view").dataset.editing="";go({tab:"recipes",view:"edit",id:null});return}
      r._added=true;draw();S.recipes=[...S.recipes,rec];saveCache();rerender();
      const ok=await write("recipes",()=>S.api.saveRecipe(rec));if(ok)toast(t("added2")+" · "+rec.name)};
    $("#askf").onsubmit=async ev=>{ev.preventDefault();if(busy)return;const q=$("#askQ").value.trim();if(!q){$("#askQ").focus();return}
      askState.q=q;busy=true;$("#askGo").disabled=true;askState.results=null;draw();msg(`<span class="spin"></span>${esc(t("askThinking"))}`);
      try{const out=await S.api.callFn({mode:"suggest",q,count:askState.count,lang,have:S.products.map(p=>p.name).slice(0,60)});
        askState.results=out.recipes||[];msg("");draw();res.scrollIntoView({behavior:"smooth",block:"start"})}
      catch(e){msg(esc(e.code==="setup"?t("aiSetup"):errMsg(e)),"warn")}
      finally{busy=false;const g=$("#askGo");if(g)g.disabled=false}};
    if(!askState.results)setTimeout(()=>$("#askQ").focus(),60);
  });
}

/* AI import */
async function shrinkImage(file,max=1280){ // -> {mime,data(base64),preview} JPEG, longest side <= max
  const url=URL.createObjectURL(file);
  try{const img=await new Promise((ok,bad)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=bad;i.src=url});
    const k=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement("canvas");
    c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    const d=c.toDataURL("image/jpeg",0.82);return {mime:"image/jpeg",data:d.split(",")[1],preview:d}}
  finally{URL.revokeObjectURL(url)}
}
function sheetAI(pre={}){
  if(!CLOUD){toast(t("aiDemo"));return}
  const shots=[];let busy=false,vid=null;
  openSheet(`<form class="stack" id="aif" autocomplete="off">
    <div class="row"><span class="aiic">${ICON.sparkle}</span><h2 class="sec grow" style="font-size:19px;margin:0">${t("aiImport")}</h2></div>
    <div><label class="f">${t("aiLink")}</label><input type="url" id="aiUrl" inputmode="url" placeholder="https://www.instagram.com/reel/…" value="${esc(pre.url||"")}"></div>
    <div><label class="f">${t("aiText")}</label><textarea dir="auto" id="aiText" style="min-height:90px">${esc(pre.text||"")}</textarea>
      <div class="muted small" style="margin-top:4px">${t("aiTextHint")}</div></div>
    <div><label class="f">${t("aiShots")}</label><div class="thumbs" id="aiThumbs"></div>
      <div class="grid2" style="margin-top:6px"><label class="btn ghost" style="cursor:pointer">${ICON.image}${t("aiAddShots")}<input type="file" id="aiFile" accept="image/*" multiple class="hidden"></label>
      <label class="btn ghost" style="cursor:pointer">${ICON.film}${t("video").split(" (")[0]}<input type="file" id="aiVid" accept="video/*" class="hidden"></label></div>
      <div class="muted small" style="margin-top:4px">${t("videoHint")}</div><div id="aiVidInfo"></div></div>
    <div id="aiMsg"></div>
    <div class="grid2"><button type="button" class="btn ghost" id="aic">${t("cancel")}</button><button class="btn primary" id="aiGo">${ICON.sparkle}${t("aiGo")}</button></div>
  </form>`,()=>{
    const drawThumbs=()=>{$("#aiThumbs").innerHTML=shots.map((s,i)=>`<div class="thumb"><img src="${s.preview}" alt=""><button type="button" class="x" data-rm="${i}">×</button></div>`).join("")
      +(vid?`<div class="thumb"><img src="${vid.frames[0]&&vid.frames[0].preview||""}" alt=""><span class="vbadge">${ICON.film}${vid.frames.length}</span><button type="button" class="x" data-rmv="1">×</button></div>`:"")};
    $("#aiThumbs").addEventListener("click",e=>{if(e.target.closest("[data-rmv]")){vid=null;$("#aiVidInfo").innerHTML="";drawThumbs()}});
    $("#aiVid").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;
      busy=true;$("#aiGo").disabled=true;$("#aiVidInfo").innerHTML=`<div class="muted small"><span class="spin"></span>${t("preparingVideo")}</div>`;
      try{const fr=await videoFrames(f,10);const au=await videoAudio(f);vid={frames:fr.frames,audio:au};
        $("#aiVidInfo").innerHTML=`<div class="muted small">✓ ${t("videoReady")} · ${fr.frames.length} 🖼${au?" · 🔊":" · "+t("videoNoAudio")}</div>`}
      catch(err){console.error(err);vid=null;$("#aiVidInfo").innerHTML=`<div class="banner warn">${esc(t("videoFail"))}</div>`}
      finally{busy=false;$("#aiGo").disabled=false;drawThumbs()}};
    $("#aiThumbs").onclick=e=>{const b=e.target.closest("[data-rm]");if(b){shots.splice(+b.dataset.rm,1);drawThumbs()}};
    $("#aiFile").onchange=async e=>{for(const f of [...e.target.files].slice(0,4-shots.length)){try{shots.push(await shrinkImage(f))}catch(_){}}e.target.value="";drawThumbs()};
    $("#aic").onclick=()=>{if(!busy)closeSheet()};
    const msg=(html,cls="")=>$("#aiMsg").innerHTML=html?`<div class="banner ${cls}">${html}</div>`:"";
    $("#aif").addEventListener("input",()=>{if(!busy)msg("")});
    $("#aif").onsubmit=async ev=>{ev.preventDefault();if(busy)return;
      const url=$("#aiUrl").value.trim(),text=$("#aiText").value.trim();
      if(!url&&!text&&!shots.length&&!vid){msg(esc(t("aiNeedInput")),"warn");return}
      busy=true;$("#aiGo").disabled=true;msg(`<span class="spin"></span>${esc(t("aiWorking"))}`);
      try{
        const imgs=[...shots,...(vid?vid.frames:[])].slice(0,12).map(({mime,data})=>({mime,data}));
        const res=await SupaBackend.importAI({mode:"recipe",url,text,images:imgs,audio:vid&&vid.audio||undefined,lang});
        const r=normalizeRecipe({...res.recipe,source:res.recipe.source||url});
        if(!r)throw new Error(t("badJson"));
        r.id=uuid();S.draft=r;closeSheet();$("#view").dataset.editing="";
        go({tab:"recipes",view:"edit",id:null});
        toast(res.linkNote&&!text&&!shots.length?t("aiLinkWarn"):t("aiCheck"));
      }catch(e){console.error(e);
        const linkOnly=url&&!text&&!shots.length&&!vid&&["no_recipe","link_unreadable"].includes(e.code);
        msg(esc(e.code==="setup"?t("aiSetup"):linkOnly?t("aiLinkOnly"):errMsg(e)),"warn");
        if(linkOnly){const ta=$("#aiText");ta.focus();ta.style.borderColor="var(--kcal)"}}
      finally{busy=false;const g=$("#aiGo");if(g)g.disabled=false}
    };
  });
}
/* Android "Share → Nutrition" (Web Share Target) */
function pendingShare(){
  const q=new URLSearchParams(location.search);
  if(!(q.has("url")||q.has("text")||q.has("title")))return null;
  const all=[q.get("title"),q.get("text"),q.get("url")].filter(Boolean).join("\n");
  const url=(q.get("url")||(all.match(/https?:\/\/\S+/)||[""])[0]).trim();
  const text=all.replace(url,"").trim();
  try{history.replaceState(null,"",location.pathname+"#recipes")}catch(_){}
  return {url,text};
}
let sharedIn=pendingShare();
function consumeShare(){if(sharedIn&&S.phase==="app"&&CLOUD){const p=sharedIn;sharedIn=null;route.tab="recipes";route.view="list";render();sheetAI(p)}}

/* import / export */
function normalizeRecipe(o){
  if(!o||typeof o!=="object")return null;
  const name=String(o.name||o.title||"").trim();if(!name)return null;
  let ings=o.ingredients||[];if(typeof ings==="string")ings=ings.split("\n");
  ings=ings.map(i=>typeof i==="string"?((m=>m?{name:m[1].trim(),amount:m[2].trim(),kcal:null}:{name:i.trim(),amount:"",kcal:null})(i.match(/^(.*?)\s+[-–—:]\s*(.+)$/))):{name:String(i.name||i.item||"").trim(),amount:String(i.amount??i.qty??i.quantity??"").trim(),kcal:numOrNull(i.kcal??i.calories)}).filter(i=>i.name);
  let steps=o.steps||o.instructions||[];if(typeof steps==="string")steps=steps.split("\n");
  steps=steps.map(s=>String(typeof s==="object"?(s.text||""):s).trim()).filter(Boolean);
  let tags=o.tags||[];if(typeof tags==="string")tags=tags.split(",");
  const isUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v||""));
  return {id:isUuid(o.id)?o.id:uuid(),name,servings:num(o.servings||o.yield)||1,time:numOrNull(o.time??o.time_min??o.minutes),ingredients:ings,
    kcalPerServing:numOrNull(o.kcalPerServing??o.kcal_per_serving??o.calories),protein:numOrNull(o.protein),carbs:numOrNull(o.carbs),fat:numOrNull(o.fat),
    steps,tags:tags.map(s=>String(s).trim()).filter(Boolean),notes:String(o.notes||""),source:String(o.source||o.url||"")};
}
function sheetImport(){
  openSheet(`<form class="stack" id="impf"><h2 class="sec" style="font-size:19px">${t("importR")}</h2>
    <div class="muted small">${t("importHint")}</div>
    <textarea dir="auto" id="impt" style="min-height:200px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px" placeholder='{"name": "...", "servings": 2, "ingredients": [...], "steps": [...]}'></textarea>
    <label class="btn ghost block" style="cursor:pointer">${ICON.upload}.json<input type="file" id="impfile" accept=".json,application/json,text/plain" class="hidden"></label>
    <div class="grid2"><button type="button" class="btn ghost" id="impc">${t("cancel")}</button><button class="btn primary">${t("importR")}</button></div></form>`,()=>{
    $("#impc").onclick=closeSheet;
    $("#impfile").onchange=async e=>{const f=e.target.files[0];if(f)$("#impt").value=await f.text()};
    $("#impf").onsubmit=ev=>{ev.preventDefault();
      let data;try{const raw=$("#impt").value.trim().replace(/^```(json)?/i,"").replace(/```$/,"").trim();data=JSON.parse(raw)}catch(_){toast(t("badJson"));return}
      const arr=(Array.isArray(data)?data:(data.recipes||[data])).map(normalizeRecipe).filter(Boolean);
      if(!arr.length){toast(t("badJson"));return}
      closeSheet();
      const byId=new Map(S.recipes.map(r=>[r.id,r]));arr.forEach(r=>byId.set(r.id,r));S.recipes=[...byId.values()];rerender();
      write("recipes",()=>S.api.saveRecipes(arr)).then(ok=>{if(ok){toast(`${arr.length} ${t("imported")}`);refetch("recipes",0)}});
    };
  });
}
function exportRecipes(){
  const data=S.recipes.map(({createdAt,updatedAt,...r})=>r);
  const txt=JSON.stringify(data,null,2);
  try{navigator.clipboard.writeText(txt).catch(()=>{})}catch(_){}
  try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"application/json"}));
    a.download="recipes-"+dkey(new Date())+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}catch(_){}
  toast(t("exported"));
}

/* =================== events =================== */
document.addEventListener("click",e=>{
  if(e.target.closest("#sheet"))return;
  const open=e.target.closest("[data-open]");if(open){go({view:"detail",id:open.dataset.open});return}
  const tab=e.target.closest("[data-tab]");if(tab){go({tab:tab.dataset.tab,view:"list",id:null});return}
  const a=e.target.closest("[data-act]");
  if(!a){const s=e.target.closest("[data-shop]");if(s){const it=S.shop.find(i=>i.id===s.dataset.shop);if(it)setShopDone(it.id,!it.done)}return}
  const act=a.dataset.act,r=S.recipes.find(x=>x.id===route.id);
  switch(act){
    case "edit":go({view:"edit"});break;
    case "addToday":if(r)sheetAddRecipe(r);break;
    case "toShop":if(r)sheetShopIngs(r);break;
    case "del":if(!r)break;
      if(delArm===r.id){const id=r.id;S.recipes=S.recipes.filter(x=>x.id!==id);saveCache();go({view:"list",id:null});
        write("recipes",()=>S.api.deleteRecipe(id)).then(ok=>ok&&toast(t("deleted")))}
      else{delArm=r.id;render();setTimeout(()=>{if(delArm===r.id){delArm=null;if(route.view==="detail")render()}},3000)}
      break;
    case "addIng":$("#ings").insertAdjacentHTML("beforeend",ingRow());$("#ings").lastElementChild.querySelector("input").focus();break;
    case "rmIng":a.closest(".ingrow").remove();updIngSum();break;
    case "cancel":go({view:route.id?"detail":"list"});break;
    case "goal":sheetGoal();break;
    case "dayPrev":case "dayNext":{const d=new Date(curDate+"T12:00:00");d.setDate(d.getDate()+(act==="dayPrev"?-1:1));curDate=dkey(d);render();break}
    case "dayToday":curDate=dkey(new Date());render();break;
    case "rmEntry":{const id=a.dataset.id,day=curDate;S.log[day]=(S.log[day]||[]).filter(x=>x.id!==id);rerender();write("log",()=>S.api.deleteLog(day,id));break}
    case "rmShop":removeShop([a.dataset.id]);break;
    case "clearDone":removeShop(S.shop.filter(i=>i.done).map(i=>i.id));break;
    case "clearAll":if(clearArm){clearArm=false;removeShop(S.shop.map(i=>i.id))}
      else{clearArm=true;render();setTimeout(()=>{if(clearArm){clearArm=false;if(route.tab==="shopping")render()}},3000)}break;
    case "shopFromRecipe":sheetPickRecipe();break;
    case "copyShop":{const txt=`🛒 ${t("shopping")}\n`+S.shop.filter(i=>!i.done).map(i=>`• ${i.name}${i.amount?" — "+i.amount:""}`).join("\n");
      try{navigator.clipboard.writeText(txt).then(()=>toast(t("copied")),()=>toast(t("copyFail")))}catch(_){toast(t("copyFail"))}break}
    case "tag":tagFilter=tagFilter===a.dataset.tag?"":a.dataset.tag;render();break;
    case "import":sheetImport();break;
    case "ai":sheetAI();break;
    case "ask":sheetAsk();break;
    case "translate":if(r)translateRecipe(r,a);break;
    case "openProd":{const p=S.products.find(x=>x.id===a.dataset.id);if(p)sheetProduct(p);break}
    case "saveCommon":{const f=commonFoods().find(x=>x.id===a.dataset.id);if(f)saveFoodToMine(f);break}
    case "saveOff":{const f=(window.__offRes||[])[+a.dataset.i];if(f)saveFoodToMine(f);break}
    case "offSearch":offSearchUI();break;
    case "prodPhoto":sheetProduct(null,{photo:true});break;
    case "export":exportRecipes();break;
    case "setLang":lang=a.dataset.v;LS.set("nt.lang",lang);$("#view").dataset.editing="";render();break;
    case "setTheme":theme=a.dataset.v;LS.set("nt.theme",theme);render();break;
    case "copyCode":try{navigator.clipboard.writeText(S.household.invite_code).then(()=>toast(t("copied")))}catch(_){}break;
    case "newCode":safe(async()=>{await SupaBackend.newInviteCode();render()});break;
    case "signOut":safe(async()=>{if(SupaBackend.channel)SupaBackend.sb.removeChannel(SupaBackend.channel);await SupaBackend.sb.auth.signOut();
      LS.del("nt2.lastHousehold");S.recipes=[];S.shop=[];S.log={};S.members=[];S.loaded=false;S.phase="auth";authMode="in";authErr=authMsg="";route.tab="recipes";render();window.scrollTo(0,0)});break;
    case "authIn":authMode="in";authErr=authMsg="";render();break;
    case "authUp":authMode="up";authErr=authMsg="";render();break;
    case "forgot":{const em=($("#aEmail")&&$("#aEmail").value.trim())||"";if(!em){authErr=t("email")+"?";render();return}
      safe(async()=>{const {error}=await SupaBackend.sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});if(error)throw error;authErr="";authMsg=t("resetSent");render()});break}
    case "install":if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.finally(()=>{deferredPrompt=null;renderBanner()})}break;
    case "dismissInstall":LS.set("nt.installDismissed",true);renderBanner();break;
    case "retry":location.reload();break;
  }
});
document.addEventListener("input",e=>{
  const el=e.target;
  if(el.classList&&el.classList.contains("in-name")){const row=el.closest(".ingrow");const st=rowState(row);
    if(st.food){st.food=null;st.p=st.c=st.f=null;row.classList.remove("auto")}}
  if(el.hasAttribute&&el.hasAttribute("data-food"))openFoodSuggest(el);
  if(el.classList&&el.classList.contains("in-amt")){recalcRow(el.closest(".ingrow"))}
  if(el.classList&&el.classList.contains("in-kcal")){const row=el.closest(".ingrow");row.classList.remove("auto")}
  if(el.closest("#editForm"))updIngSum()});
document.addEventListener("focusout",e=>{if(e.target.hasAttribute&&e.target.hasAttribute("data-food"))setTimeout(()=>{if(!document.activeElement||!document.activeElement.hasAttribute("data-food"))closeSuggest()},180)});
document.addEventListener("focusin",e=>{if(e.target.hasAttribute&&e.target.hasAttribute("data-food"))openFoodSuggest(e.target)});
/* one suggestion list for every food field: your products first (shown as soon as the field is tapped), then common foods */
function foodListFor(el){const q=el.value.trim();
  if(!q)return [...S.products].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||""))||a.name.localeCompare(b.name)).slice(0,8).map(p=>({...p,mine:true}));
  return searchFoods(q,8)}
function openFoodSuggest(el){showSuggest(el,foodListFor(el),food=>el.dispatchEvent(new CustomEvent("foodpick",{detail:food,bubbles:true})))}
document.addEventListener("foodpick",e=>{const el=e.target,food=e.detail;
  if(el.classList.contains("in-name")){const row=el.closest(".ingrow"),st=rowState(row);el.value=food.name;st.food=foodSnap(food);
    const amt=row.querySelector(".in-amt");if(!amt.value.trim())amt.value=defaultAmount(food);recalcRow(row);updIngSum();amt.focus();amt.select&&amt.select()}
  else if(el.id==="shopIn"){el.value=food.name+" - ";el.focus();try{el.setSelectionRange(el.value.length,el.value.length)}catch(_){}}
});
/* link ingredients whose name matches one of your products (e.g. after AI import) */
function autoLinkRows(){const f=$("#editForm");if(!f)return;let changed=false;
  f.querySelectorAll(".ingrow").forEach(row=>{const st=rowState(row);if(st.food)return;const nm=norm(row.querySelector(".in-name").value);if(!nm)return;
    const mine=S.products.find(p=>norm(p.name)===nm);const com=!mine&&commonFoods().find(c=>norm(c.name)===nm||norm(c.alt)===nm);
    const food=mine||com;if(!food)return;const kcalEl=row.querySelector(".in-kcal");
    if(mine||!kcalEl.value.trim()){st.food=foodSnap(food);if(foodNutrition(st.food,row.querySelector(".in-amt").value)){recalcRow(row);changed=true}else if(!mine)st.food=null}});
  if(changed)updIngSum()}
document.addEventListener("submit",e=>{
  const id=e.target.id;
  if(["shopForm","editForm","authForm","createHh","joinHh","hhRename","hhJoin","meRename"].includes(id))e.preventDefault();
  if(id==="shopForm"){const inp=$("#shopIn"),v=inp.value.trim();if(!v)return;
    const m=v.match(/^(.*?)\s+[-–—:]\s*(.+)$/)||v.match(/^(.*?)[–—:]\s*(.+)$/);inp.value="";
    addShopItems([m?{name:m[1],amount:m[2]}:{name:v}]);setTimeout(()=>{const n=$("#shopIn");if(n)n.focus()},0);return}
  if(id==="authForm"){const email=$("#aEmail").value.trim(),pw=$("#aPass").value,nm=$("#aName")&&$("#aName").value.trim();
    const btn=$("#authGo");btn.disabled=true;authErr=authMsg="";
    (async()=>{try{const sb=SupaBackend.sb;
      if(authMode==="up"){const {data,error}=await sb.auth.signUp({email,password:pw,options:{data:{name:nm},emailRedirectTo:location.origin+location.pathname}});if(error)throw error;
        if(!data.session){authMode="in";authMsg=t("checkEmail");render();return}
        authMode="in";await afterLogin(data.user)}
      else{const {data,error}=await sb.auth.signInWithPassword({email,password:pw});if(error)throw error;await afterLogin(data.user)}
    }catch(err){authErr=errMsg(err);render();const em=$("#aEmail");if(em)em.value=email}})();return}
  if(id==="createHh"||id==="joinHh"){const display=($("#oName").value||"").trim()||(S.user.email||"").split("@")[0];
    safe(async()=>{const h=id==="createHh"?await SupaBackend.createHousehold($("#oHh").value.trim(),display)
      :await SupaBackend.joinHousehold($("#oCode").value.trim(),display);await enterHousehold(h);render()});return}
  if(id==="hhRename"){safe(async()=>{await SupaBackend.renameHousehold($("#hhName").value.trim()||"Home");toast(t("saved"));render()});return}
  if(id==="meRename"){safe(async()=>{await SupaBackend.renameMe($("#meName").value.trim());S.members=await SupaBackend.members();toast(t("saved"));render()});return}
  if(id==="hhJoin"){const code=$("#joinCode").value.trim();if(!code)return;const me=S.members.find(m=>m.user_id===S.user.id);
    safe(async()=>{const h=await SupaBackend.joinHousehold(code,(me&&me.display_name)||(S.user.email||"").split("@")[0]);
      S.recipes=[];S.shop=[];await enterHousehold(h);go({tab:"recipes",view:"list"})});return}
  if(id!=="editForm")return;
  const f=e.target,name=f.rname.value.trim();if(!name){toast(t("needName"));return}
  const old=route.id?S.recipes.find(x=>x.id===route.id):null;
  const ings=[...f.querySelectorAll(".ingrow")].map(row=>{const st=rowState(row);
    const o={name:row.querySelector(".in-name").value.trim(),amount:row.querySelector(".in-amt").value.trim(),kcal:numOrNull(row.querySelector(".in-kcal").value)};
    if(st.food){o.food=st.food;if(st.p!=null)o.protein=st.p;if(st.c!=null)o.carbs=st.c;if(st.f!=null)o.fat=st.f}
    else{if(st.p!=null)o.protein=st.p;if(st.c!=null)o.carbs=st.c;if(st.f!=null)o.fat=st.f}
    return o}).filter(i=>i.name);
  const rec={...(old||{}),id:old?old.id:uuid(),name,servings:num(f.servings.value)||1,time:numOrNull(f.time.value),ingredients:ings,
    kcalPerServing:numOrNull(f.kcalPerServing.value),protein:numOrNull(f.protein.value),carbs:numOrNull(f.carbs.value),fat:numOrNull(f.fat.value),
    steps:f.steps.value.split("\n").map(s=>s.trim()).filter(Boolean),
    tags:f.tags.value.split(/[,،]/).map(s=>s.trim()).filter(Boolean),notes:f.notes.value.trim(),source:f.source.value.trim()};
  const i=S.recipes.findIndex(x=>x.id===rec.id);if(i>=0)S.recipes[i]=rec;else S.recipes.push(rec);saveCache();
  $("#view").dataset.editing="";go({view:"detail",id:rec.id});
  write("recipes",()=>S.api.saveRecipe(rec)).then(ok=>ok&&toast(t("saved")));
});
$("#backBtn").onclick=()=>{
  if(route.tab==="settings"){go({tab:route.prevTab||"recipes",view:"list"});return}
  if(route.view==="edit")go({view:route.id?"detail":"list"});else go({view:"list",id:null})};
$("#gearBtn").onclick=()=>{route.prevTab=["today","recipes","shopping","products"].includes(route.tab)?route.tab:"recipes";go({tab:"settings",view:"list"});
  if(CLOUD&&S.household)SupaBackend.members().then(m=>{S.members=m;if(route.tab==="settings")rerender()}).catch(()=>{})};
$("#fab").onclick=()=>{if(route.tab==="today")sheetQuick();else if(route.tab==="products")sheetProduct(null);else{$("#view").dataset.editing="";go({view:"edit",id:null})}};
$("#langBtn").onclick=()=>{lang=lang==="he"?"en":"he";LS.set("nt.lang",lang);$("#view").dataset.editing="";render()};
$("#themeBtn").onclick=()=>{theme=theme==="dark"?"light":"dark";LS.set("nt.theme",theme);applyChrome()};
const TABS=["today","recipes","shopping","products"];
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(TABS.includes(h)&&h!==route.tab)go({tab:h,view:"list",id:null})});
{const h=location.hash.slice(1);if(TABS.includes(h))route.tab=h;if(!TABS.includes(route.tab))route.tab="recipes";if(sharedIn)route.tab="recipes"}

/* service worker (offline + installable) */
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(e=>console.warn("SW",e)));
}
boot();
