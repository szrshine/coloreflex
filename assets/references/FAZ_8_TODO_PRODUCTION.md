# Faz 8: Store Hazırlığı - Production TODO

## 📋 Genel Bakış

Bu faz, ColorDrop oyununun App Store (iOS) ve Google Play Store (Android) için hazırlanmasını içerir.

---

## 🍎 App Store Connect Hazırlığı (iOS)

### 1.1 Apple Developer Hesabı

**Gereksinimler:**
- [ ] Apple Developer Program üyeliği ($99/yıl)
- [ ] Apple ID hazır
- [ ] Ödeme yöntemi (kredi kartı) ekli

**Adımlar:**
1. https://developer.apple.com/programs/ adresine git
2. "Enroll" butonuna tıkla
3. Bireysel veya şirket hesabı seç
4. Gerekli bilgileri doldur
5. Ödeme yap ($99/yıl)
6. Onay bekle (1-2 gün sürebilir)

### 1.2 App Store Connect'te Uygulama Oluşturma

**Adımlar:**
1. https://appstoreconnect.apple.com/ adresine git
2. "My Apps" tıkla
3. "+" butonuna tıkla > "New App"
4. Bilgileri doldur:

**Uygulama Bilgileri:**
```
Platform: iOS
Name: ColorDrop
Primary Language: English (U.S.)
Bundle ID: com.szrgame.colordrop (app.json'dan)
SKU: colordrop-001 (benzersiz ID)
User Access: Full Access
```

### 1.3 App Store Metadata (English)

**App Information:**
```
Name: ColorDrop
Subtitle: Fast Color Matching Game (30 char max)

Category:
  Primary: Games > Puzzle
  Secondary: Games > Arcade

Age Rating:
  - Violence: None
  - Sexual Content: None
  - Profanity/Crude Humor: None
  - Gambling: None
  - Unrestricted Web Access: No
  - Result: 4+

Privacy Policy URL: https://github.com/szrshine/ColorDrop/blob/main/assets/legal/privacy-policy.md

Support URL: https://github.com/szrshine/ColorDrop

Marketing URL (Optional): https://github.com/szrshine/ColorDrop
```

**Version Information:**
```
Version: 1.0.0
Copyright: 2025 SZR Game Studios
```

**Description (Max 4000 characters):**
```
Match the Colors, Beat the Clock!

ColorDrop is an addictive color-matching puzzle game that challenges your reflexes and concentration. Watch colorful balls fall from the sky and tap the matching color bar to score points. Simple to learn, hard to master!

🎯 HOW TO PLAY
• Watch the falling colored balls
• Tap the matching color bar at the bottom
• Score points for correct matches
• Avoid wrong matches or you'll lose lives
• Beat your high score and climb the leaderboard!

✨ FEATURES
• Simple, intuitive one-tap gameplay
• Beautiful, vibrant graphics
• Increasing difficulty as you progress
• Global leaderboards - compete worldwide
• Daily, weekly, and monthly rankings
• Achievements system
• Multiple game modes
• Power-ups to boost your score
• Customizable themes and skins
• Offline play supported
• No time limits - play at your own pace
• Perfect for quick gaming sessions

🎨 CUSTOMIZATION
• 10+ unique ball skins
• Multiple color themes
• Unlock new content as you play

🏆 COMPETE & ACHIEVE
• Global leaderboards
• 20+ achievements to unlock
• Track your statistics
• Share your scores with friends

🎮 GAME MODES
• Classic Mode: Traditional gameplay
• Time Attack: Race against the clock
• Endless Mode: How long can you survive?

💎 POWER-UPS
• Slow Motion: Slow down time
• Shield: Protect from mistakes
• Freeze: Stop balls mid-air
• Bonus Points: Double your score

Perfect for:
✓ Quick coffee break gaming
✓ Daily commute entertainment
✓ Improving hand-eye coordination
✓ Casual and hardcore gamers
✓ All ages (4+)

Download ColorDrop now and start matching! Can you reach the top of the leaderboard?

NO ADS OPTION AVAILABLE
Enjoy ad-free gaming with our one-time purchase option.

SUPPORT
Having issues or feedback? Contact us at support@szrgame.com

Follow us for updates and new features!
```

**Keywords (Max 100 characters, comma-separated):**
```
color,match,puzzle,casual,game,reflex,brain,quick,drop,fall,arcade,addictive,fun
```

**Promotional Text (Max 170 characters - updateable):**
```
New features: Power-ups, daily challenges, and customizable themes! Match colors, beat your high score, and climb the global leaderboard!
```

**What's New in Version 1.0.0:**
```
Welcome to ColorDrop!

• Fast-paced color matching gameplay
• Global leaderboards
• 20+ achievements
• Multiple game modes
• Power-ups and customization
• Daily challenges
• Beautiful graphics and smooth animations

Thank you for downloading! We'd love to hear your feedback.
```

### 1.4 App Store Screenshots & Videos

**Required Screenshot Sizes:**

**6.7" iPhone (iPhone 14 Pro Max, iPhone 15 Plus):**
- Size: 1290 x 2796 pixels
- Quantity: 6-10 screenshots
- Format: PNG or JPEG

**6.5" iPhone (iPhone 11 Pro Max, iPhone XS Max):**
- Size: 1242 x 2688 pixels
- Quantity: 6-10 screenshots

**5.5" iPhone (iPhone 8 Plus):**
- Size: 1242 x 2208 pixels
- Quantity: 6-10 screenshots

**iPad Pro (12.9-inch) - Optional but recommended:**
- Size: 2048 x 2732 pixels
- Quantity: 6-10 screenshots

**Screenshot Content Suggestions:**
1. **Main Menu** - Show ColorDrop logo and start button
2. **Gameplay** - Balls falling with score display
3. **Perfect Match** - Show combo/streak animation
4. **Leaderboard** - Show global rankings
5. **Achievements** - Display unlocked achievements
6. **Power-ups** - Show available power-ups
7. **Customization** - Skin/theme selection screen
8. **Game Over** - High score screen

**App Preview Video (Optional but recommended):**
- Max duration: 30 seconds
- Format: MP4, M4V, or MOV
- Resolution: Same as screenshot sizes
- Show: Gameplay, features, and what makes it fun

### 1.5 App Review Information

```
Sign-in Required: No

Contact Information:
  First Name: [Your First Name]
  Last Name: [Your Last Name]
  Phone Number: [Your Phone]
  Email: support@szrgame.com

Notes for Reviewer:
"ColorDrop is a simple color-matching puzzle game. No sign-in required.
Just download and start playing immediately. All features are accessible
from the main menu. AdMob ads are integrated (banner and interstitial).
In-app purchases available for ad removal and cosmetic items."

Demo Account: Not required (no login system)
```

### 1.6 Pricing and Availability

```
Price: Free
Availability: All countries
Pre-order: No
```

### 1.7 In-App Purchases (to be configured)

```
1. Remove Ads - $2.99 (Non-Consumable)
2. Premium Skin Pack - $1.99 (Non-Consumable)
3. Power-Up Pack (5x) - $0.99 (Consumable)
4. Coin Pack Small - $0.99 (Consumable)
5. Coin Pack Medium - $4.99 (Consumable)
6. Coin Pack Large - $9.99 (Consumable)
```

---

## 🤖 Google Play Console Hazırlığı (Android)

### 2.1 Google Play Console Hesabı

**Gereksinimler:**
- [ ] Google hesabı
- [ ] Tek seferlik $25 kayıt ücreti
- [ ] Geçerli kredi kartı

**Adımlar:**
1. https://play.google.com/console adresine git
2. "Create Account" tıkla
3. Developer hesap türü seç (Individual veya Organization)
4. Gerekli bilgileri doldur
5. $25 kayıt ücretini öde
6. Hesap onayını bekle (birkaç saat - 1 gün)

### 2.2 Play Console'da Uygulama Oluşturma

**Adımlar:**
1. Play Console'a giriş yap
2. "Create app" butonuna tıkla
3. Bilgileri doldur:

```
App name: ColorDrop
Default language: English (United States)
App or game: Game
Free or paid: Free

Declarations:
☑ Developer Program Policies
☑ US export laws
```

### 2.3 Store Listing (English)

**App details:**
```
App name: ColorDrop
Short description (80 chars max):
"Fast-paced color matching puzzle game. Match drops and beat your high score!"

Full description (4000 chars max):
```
```markdown
🎯 Match the Colors, Beat the Clock!

ColorDrop is the ultimate color-matching puzzle game that will test your reflexes and keep you coming back for more! Watch vibrant colored balls fall from the sky and tap the matching color to score points. Easy to pick up, impossible to put down!

HOW TO PLAY 🎮
Match falling colored balls with the correct color bar at the bottom of the screen. Each correct match increases your score and speeds up the game. But be careful - wrong matches cost you lives! How long can you survive?

FEATURES ✨
▸ Simple one-tap gameplay - anyone can play!
▸ Beautiful, colorful graphics
▸ Smooth animations and satisfying effects
▸ Progressive difficulty - starts easy, gets challenging
▸ Global leaderboards - compete with players worldwide
▸ Daily, weekly, and monthly rankings
▸ 20+ achievements to unlock
▸ Multiple exciting game modes
▸ Powerful power-ups to boost your gameplay
▸10+ unique skins and themes
▸ Offline play supported - no internet required
▸ Quick gaming sessions - perfect for breaks
▸ Free to play with optional purchases

CUSTOMIZATION 🎨
Personalize your gaming experience with:
• Unique ball skins
• Color themes
• Unlock rewards as you progress

COMPETE & ACHIEVE 🏆
• Climb the global leaderboards
• Unlock 20+ achievements
• Track your personal statistics
• Share your best scores with friends
• Challenge yourself daily

GAME MODES 🎯
• CLASSIC: Traditional color matching
• TIME ATTACK: Beat the clock!
• ENDLESS: Survive as long as you can
• DAILY CHALLENGE: New challenge every day

POWER-UPS 💎
Boost your gameplay with special power-ups:
• Slow Motion - Slow down time when you need it
• Shield - Protect yourself from mistakes
• Freeze - Stop balls in mid-air
• Score Multiplier - Double your points

PERFECT FOR 👥
✓ Quick coffee break entertainment
✓ Commute gaming
✓ Improving reaction time and hand-eye coordination
✓ Casual gamers and puzzle fans
✓ Players of all ages (rated 3+)
✓ Anyone who loves addictive, simple games

AD-FREE OPTION 🚫
Enjoy uninterrupted gaming! Purchase our ad-free version for a one-time fee.

SUPPORT 💬
Questions? Feedback? We'd love to hear from you!
Email: support@szrgame.com

Download ColorDrop now and start your color-matching adventure! Can you beat the high score? 🌟

Note: This game contains optional in-app purchases and ads. Ads can be removed with a one-time purchase.
```

**App category:**
```
Category: Games > Puzzle
Tags: casual, color, match, puzzle, arcade, reflex, brain, quick
```

**Contact details:**
```
Email: support@szrgame.com
Website: https://github.com/szrshine/ColorDrop
Phone: [Optional]
```

**Store settings:**
```
☑ Contains ads
☐ Offers in-app purchases (akan eklediğinizde işaretleyin)
```

### 2.4 Graphics & Assets

**App icon:**
- Size: 512 x 512 pixels
- Format: 32-bit PNG (with alpha)
- Max file size: 1024 KB

**Feature Graphic (ÇOK ÖNEMLİ):**
- Size: 1024 x 500 pixels
- Format: JPEG or 24-bit PNG (no alpha)
- This appears at the top of your store listing

**Phone screenshots:**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: JPEG or 24-bit PNG
- Min dimension: 320px
- Max dimension: 3840px
- Aspect ratio: Between 16:9 and 2:1

**7" Tablet screenshots (Optional):**
- Same requirements as phone

**10" Tablet screenshots (Optional):**
- Same requirements as phone

**Promo Video (Optional):**
- YouTube video URL
- Max duration: 2 minutes
- Show gameplay and features

**Feature Graphic Design Ideas:**
```
Background: Colorful gradient (blue to purple)
Text: "ColorDrop" - Large, bold font
Subtext: "Match Colors, Beat Your Score!"
Graphics: Falling colored balls
Call-to-action: "Download Now" or "Play Free"
```

### 2.5 Content Rating

**IARC Questionnaire:**
1. Go to "Content Rating" section
2. Start questionnaire
3. Answer questions:

```
Category: Games

Violence:
- Does your app contain violent content? NO
- Does your app contain realistic violence? NO

Sexual Content:
- Does your app contain sexual content? NO

Language:
- Does your app contain profanity? NO

Controlled Substances:
- Does your app reference alcohol, tobacco, or drugs? NO

Gambling:
- Does your app contain gambling? NO

User Interaction:
- Can users interact with each other? YES (leaderboards)
- Does your app share user location? NO
- Does your app allow personal information to be shared? NO

Ads:
- Does your app contain ads? YES
```

**Result:** PEGI 3 / ESRB Everyone / USK 0

### 2.6 Data Safety

**Data Collection & Security:**
```
Does your app collect or share user data?
☑ Yes

Data types collected:
☑ Device or other IDs
☑ App activity (how users interact with the app)

Is data encrypted in transit? ☑ Yes
Can users request data deletion? ☑ Yes

Data usage:
☑ Analytics
☑ Advertising

Data sharing:
☑ Data is shared with third parties (AdMob, Firebase)
```

**Privacy Policy:**
```
URL: https://github.com/szrshine/ColorDrop/blob/main/assets/legal/privacy-policy.md
```

### 2.7 Target Audience & Content

```
Target age: 3 and older
Target audience: General
```

### 2.8 News Apps Declaration

```
☐ This is a news app (NO)
```

### 2.9 App Access

```
All functionality is available without restrictions
☐ Special access instructions (No login required)
```

---

## 🎨 Store Assets Creation Guide

### 3.1 Screenshot Strategy

**Layout for Each Screenshot:**
1. Show actual gameplay in device frame
2. Add text overlay explaining feature
3. Use consistent color scheme
4. Keep text minimal and readable
5. Show UI elements clearly

**Screenshot Sequence:**
```
Screenshot 1: Main Menu + "Welcome to ColorDrop!"
Screenshot 2: Gameplay + "Match Falling Colors"
Screenshot 3: Combo/Streak + "Build Combos for Bonus Points"
Screenshot 4: Leaderboard + "Compete Globally"
Screenshot 5: Achievements + "Unlock 20+ Achievements"
Screenshot 6: Power-ups + "Use Power-ups to Boost Score"
Screenshot 7: Skins + "Customize Your Game"
Screenshot 8: Game Over + "Beat Your High Score!"
```

### 3.2 Tools for Creating Assets

**Screenshot Creation:**
- Xcode Simulator (iOS)
- Android Studio Emulator (Android)
- Figma (for designs and overlays)
- Canva (for text overlays)

**Feature Graphic:**
- Figma: https://www.figma.com/
- Canva: https://www.canva.com/
- Photoshop (if available)

**App Preview Video:**
- OBS Studio (screen recording)
- QuickTime Player (Mac screen recording)
- DaVinci Resolve (editing, free)
- iMovie (Mac, simple editing)

### 3.3 Design Tips

**Colors:**
- Use your app's color palette
- High contrast for readability
- Bright, eye-catching colors

**Fonts:**
- Bold, sans-serif fonts
- Minimum 24pt for readability
- Consistent font family

**Composition:**
- 60% app screenshot, 40% text/graphics
- Leave breathing room
- Align elements properly

---

## 🔍 ASO (App Store Optimization)

### 4.1 Keyword Research

**Primary Keywords:**
```
- color match
- puzzle game
- color game
- casual game
- reflex game
- brain game
- match game
- drop game
- quick game
- arcade game
```

**Long-tail Keywords:**
```
- color matching puzzle
- fast paced puzzle
- addictive color game
- quick casual game
- brain training game
- reflex training
```

**Tools for Keyword Research:**
- App Annie (now data.ai)
- Sensor Tower
- Mobile Action
- App Radar
- Google Play Console (search terms report - after launch)

### 4.2 Competitor Analysis

**Similar Games to Research:**
```
- Color Switch
- Ballz
- Stack Ball
- Helix Jump
- Color Bump 3D
```

**What to analyze:**
- Their keywords
- Description structure
- Screenshot style
- Ratings and reviews
- What users complain about (your opportunity!)

### 4.3 Title Optimization

**App Store (iOS):**
```
Title: ColorDrop
Subtitle: Color Matching Puzzle Game
```

**Google Play (Android):**
```
Title: ColorDrop - Color Match Game
```

### 4.4 Description Best Practices

**Structure:**
1. Hook (first 2 lines) - Most important!
2. How to play
3. Features (bullet points)
4. Benefits
5. Social proof (after you get users)
6. Call-to-action

**Keywords:**
- Use primary keywords in first paragraph
- Repeat important keywords naturally 2-3 times
- Don't keyword stuff
- Write for humans, optimize for search

### 4.5 Localization Planning (Future)

**Priority Languages:**
```
1. English (US) - Launch
2. Spanish (es-ES, es-MX)
3. Portuguese (Brazil)
4. German (de-DE)
5. French (fr-FR)
6. Turkish (tr-TR)
7. Chinese Simplified (zh-CN)
8. Japanese (ja-JP)
```

**Note:** Start with English, add languages based on user demographics after launch.

---

## ✅ Pre-Launch Checklist

### App Configuration
- [ ] app.json version correct (1.0.0)
- [ ] Bundle ID/Package name correct
- [ ] All required icons present
- [ ] Splash screen configured
- [ ] Privacy Policy URL valid
- [ ] Terms of Service URL valid
- [ ] Support email valid

### App Store Connect
- [ ] App created in App Store Connect
- [ ] Metadata filled (name, description, keywords)
- [ ] Screenshots uploaded (all sizes)
- [ ] App icon uploaded
- [ ] Privacy policy URL added
- [ ] Age rating completed
- [ ] Pricing set (Free)
- [ ] Availability regions selected
- [ ] App Review Information filled

### Google Play Console
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Feature graphic uploaded
- [ ] Screenshots uploaded
- [ ] App icon uploaded
- [ ] Content rating completed (IARC)
- [ ] Data safety section completed
- [ ] Privacy policy URL added
- [ ] Pricing set (Free)

### Marketing Materials
- [ ] All screenshots created
- [ ] Feature graphic designed
- [ ] App preview video recorded (optional)
- [ ] Social media posts prepared
- [ ] Press kit ready (optional)

### Legal
- [ ] Privacy Policy published and accessible
- [ ] Terms of Service published and accessible
- [ ] URLs working correctly
- [ ] All policies compliant with stores

### ASO
- [ ] Keyword research completed
- [ ] Title optimized
- [ ] Description optimized
- [ ] Competitor analysis done
- [ ] Screenshots tell a story

---

## 📊 Post-Setup Monitoring

**After submission, track:**
1. Review time (1-3 days iOS, few hours Android)
2. Rejection reasons (if any)
3. First impressions/installs
4. Crash reports
5. User reviews and ratings
6. Keyword rankings
7. Conversion rate (page visit to install)

---

## 🔗 Useful Resources

**Apple:**
- App Store Connect: https://appstoreconnect.apple.com/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

**Google:**
- Play Console: https://play.google.com/console
- Play Store Policies: https://play.google.com/about/developer-content-policy/
- Material Design: https://material.io/design

**ASO Tools:**
- App Annie (data.ai): https://www.data.ai/
- Sensor Tower: https://sensortower.com/
- Mobile Action: https://www.mobileaction.co/

**Design Tools:**
- Figma: https://www.figma.com/
- Canva: https://www.canva.com/
- Screenshot Templates: https://www.screenshotbuilder.com/

---

## 💡 Pro Tips

1. **Screenshots are your #1 conversion tool** - Invest time here
2. **First 3 lines of description** are visible without "Read more"
3. **Update screenshots** when you add new features
4. **A/B test** different screenshots after launch
5. **Respond to reviews** - shows you care
6. **Localize** based on where users come from
7. **Feature graphic** should work as a standalone ad
8. **Icon** should be recognizable at small sizes
9. **Keywords** in app name carry most weight
10. **Keep updating** - active apps rank better

---

## 🚀 Next Steps (After Faz 8)

1. **Faz 9:** Build & Submit
   - Create production builds
   - Upload to stores
   - Submit for review

2. **Faz 10:** Launch & Marketing
   - Soft launch strategy
   - Social media promotion
   - Get initial reviews

3. **Faz 11:** Monitor & Iterate
   - Track metrics
   - Fix bugs
   - Respond to feedback
   - Plan updates

---

**Başarılar! Store'da görüşmek üzere! 🎉**
