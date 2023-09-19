export default function highlight(modules, input, result) {
  const matched = modules.match(result, input);
  const matchPattern = modules.reduce(matched).map(function(range) {
    return range.map(function(index) {
      return result.charAt(index);
    }).join('').replace(/\W/g, '\\$&');
  }).join('|');

  const matcher = new RegExp(matchPattern, 'gi');
  return result.replace(matcher, modules.wrap);
}
