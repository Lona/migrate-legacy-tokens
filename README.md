# Migrate legacy tokens

Lona originally used a flat list of colors/shadows/textStyles to represent tokens.

To convert a file in this format to the new (markdown + code) format, navigate to the root of your Lona workspace (or wherever the JSON files are), and run:

```
npx @lona/migrate-legacy-tokens colors.json > Colors.md
npx @lona/migrate-legacy-tokens textStyles.json > TextStyles.md
npx @lona/migrate-legacy-tokens shadows.json > Shadows.md
```
