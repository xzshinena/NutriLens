# 🔑 API Keys Setup Instructions

To use all the features of NutriLens, you'll need to set up API keys for various services.

## 📋 Required API Keys

### 1. Google Gemini AI (Required for Dietary Analysis)
- **Purpose**: AI-powered dietary restriction analysis
- **Get your key**: https://makersuite.google.com/app/apikey
- **Free tier**: Yes, generous limits
- **Setup**: 
  1. Go to Google AI Studio
  2. Click "Get API Key"
  3. Create new API key
  4. Copy the key

### 2. OpenFoodFacts (No Key Required)
- **Purpose**: Primary nutrition database
- **Cost**: Free
- **Setup**: Already configured! 🎉

## 🔧 Environment Setup
Create a `.env` file in your project root:

\`\`\`bash
# Required for AI dietary analysis
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

## ⚠️ Important Security Notes

1. **Never commit API keys** to version control
2. Add `.env` to your `.gitignore` file
3. Use `EXPO_PUBLIC_` prefix for client-side keys in Expo
4. Keep your Gemini API key secure - it provides powerful AI capabilities

## 🚀 Quick Start (Minimum Setup)

To get started quickly, you only need:

1. **Gemini API Key** - for dietary analysis
2. **OpenFoodFacts** works without any key

The app will work with just the Gemini key, using OpenFoodFacts as the primary data source.

## 🧪 Testing Your Setup

1. Add your Gemini API key to `.env`
2. Restart your Expo dev server (`npm start`)
3. Scan a barcode (try: 5000112548167 - Coca Cola)
4. Select a dietary restriction (like "Vegan")
5. You should see AI-powered analysis!

## 💡 Pro Tips

- Start with just the Gemini API key
- Add other APIs later if you need more product coverage
- The app gracefully handles missing API keys
- Test with common products first (Coca Cola, Nutella, etc.)

## 🆘 Troubleshooting

**"Analysis not working"**
- Check your Gemini API key is correct
- Make sure you restarted the Expo server after adding the key
- Verify the key has sufficient quota

**"Product not found"** 
- Try different barcodes
- Some products might not be in any database
- OpenFoodFacts has the largest coverage globally

**"Nutritionix/USDA errors"**
- These are optional APIs
- The app works fine with just OpenFoodFacts
- Check your API keys if you want to use them

---

Happy scanning! 🎉
