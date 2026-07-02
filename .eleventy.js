const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("_headers");

  eleventyConfig.addFilter("paragraphs", (value) => {
                                           if (!value) return "";
                                           return value
                                             .split(/\n\s*\n/)
                                             .map((p) => p.trim())
                                             .filter(Boolean)
                                             .map((p) => `<p>${p}</p>`)
                                             .join("\n");
                                         });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "dist" },
  };
};
