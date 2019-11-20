const { parseCSSColor } = require("csscolorparser");

exports.convertColors = function convertColors({ colors = [] }) {
  return (
    "# Colors\n\n" +
    colors
      .map(
        ({ id, value = "black" }) =>
          `let ${id}: Color = #color(css: "${value}")`
      )
      .map(code => ["```tokens", code, "```"].join("\n"))
      .join("\n\n")
  );
};

exports.convertShadows = function convertShadows({ shadows = [] }) {
  return (
    "# Shadows\n\n" +
    shadows
      .map(
        ({ id, x = 0, y = 0, blur = 0, color = "black" }) =>
          `let ${id}: Shadow = Shadow(x: ${x}, y: ${y}, blur: ${blur}, color: #color(css: "${color}"))`
      )
      .map(code => ["```tokens", code, "```"].join("\n"))
      .join("\n\n")
  );
};

exports.convertTextStyles = function convertTextStyles({
  styles: textStyles = []
}) {
  function resolve(textStyle) {
    const { extends: _extends } = textStyle;

    if (_extends) {
      const resolved = textStyles.find(ts => ts.id === _extends);
      if (!resolved) {
        console.warn(`Failed to resolve textStyle: ${textStyle.id}`);
      }
      return Object.assign({}, resolve(resolved), textStyle);
    }
    return textStyle;
  }

  return (
    "# TextStyles\n\n" +
    textStyles
      .map(resolve)
      .map(
        ({
          id,
          fontName,
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight,
          letterSpacing,
          color
        }) => {
          const parameters = [
            ["fontName", fontName ? `Optional.value("${fontName}")` : null],
            [
              "fontFamily",
              fontFamily ? `Optional.value("${fontFamily}")` : null
            ],
            ["fontWeight", fontWeight ? `FontWeight.w${fontWeight}` : null],
            ["fontSize", fontSize ? `Optional.value(${fontSize})` : null],
            [
              "lineHeight",
              lineHeight ? `Optional.value("${lineHeight}")` : null
            ],
            [
              "letterSpacing",
              letterSpacing ? `Optional.value("${letterSpacing}")` : null
            ],
            [
              "color",
              color
                ? `Optional.value(${
                    parseCSSColor(color) ? `#color(css: "${color}")` : color
                  })`
                : null
            ]
          ]
            .filter(([name, value]) => !!value)
            .map(([name, value]) => `${name}: ${value}`)
            .join(", ");

          return `let ${id}: TextStyle = TextStyle(${parameters})`;
        }
      )
      .map(code => ["```tokens", code, "```"].join("\n"))
      .join("\n\n")
  );
};
