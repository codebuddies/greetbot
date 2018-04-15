const sortArguments = (reqArguments) => {
  let languages = [];
  let levels = [];
  let types = [];
  let costs = [];
  reqArguments.forEach(argument => {
    switch (argument.toLowerCase()) {
      // languages sort
      case 'javascript':
      case 'js': {
        languages.push('javascript');
        break;
      }
      case 'python':
      case 'ni!':
      case 'spam': {
        languages.push('python');
        break;
      }
      case 'ruby': {
        languages.push('ruby');
        break;
      }

      // levels sort
      case 'beginner':
      case 'beg': {
        levels.push('beginner');
        break;
      }
      case 'intermediate':
      case 'int':
      case 'inter': {
        levels.push('intermediate');
        break;
      }
      case 'advanced':
      case 'adv':
      case 'moar': {
        levels.push('advanced');
        break;
      }

      // types sort
      case 'book': {
        types.push('book');
        break;
      }
      case 'tutorial': {
        types.push('tutorial');
        break;
      }
      case 'class': {
        types.push('class');
        break;
      }
      case 'video': {
        types.push('video');
        break;
      }
      case 'website': {
        types.push('website');
        break;
      }

      // costs sort
      case 'free': {
        costs.push('free');
        break;
      }
      case 'paid': {
        costs.push('paid');
        break;
      }
    }
  });
  let returnArgs = {};
  if (languages.length) {
    returnArgs['language'] = languages;
  }
  if (levels.length) {
    returnArgs['level'] = levels;
  }
  if (types.length) {
    returnArgs['media-type'] = types;
  }
  if (costs.length) {
    returnArgs['media-cost-desc'] = costs;
  }
  return returnArgs;
};

module.exports = sortArguments;
