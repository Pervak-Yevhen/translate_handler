const prepareTranslate = (obj = {}, prefix = '') => {
    const list = Object.entries(obj);
    if(!list.length) return obj;
    return list.reduce((acc, [key, value]) => {
        if (value instanceof Object) {
            acc = {
                ...acc,
                ...prepareTranslate(value, `${prefix}${prefix ?'.' : ''}${key}`),
            }
        } else if (typeof value === 'string') {
            acc[`${prefix}.${key}`] = value;
        } else {
            throw new Error(`Key - ${key}: contain invalid type of value ${value}`)
        }
        return acc;
    }, {});
};

module.exports = {
    prepareTranslate,
};
