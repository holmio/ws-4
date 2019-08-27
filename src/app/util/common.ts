export function parseCategoryList(categories: string[]): Object {
    let categoriesObject = {};
    categories.forEach(item => {
        categoriesObject = Object.assign({ [item]: true }, categoriesObject);
    })
    return categoriesObject;
}

export function isUrl(str) {
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; // fragment locator
    return pattern.test(str);
}

export function timestamp() {
    return new Date().getTime();
}