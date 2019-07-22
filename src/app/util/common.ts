export function parseCategoryList(categories: string[]): Object {
    let categoriesObject = {};
    categories.forEach(item => {
        categoriesObject = Object.assign({ [item]: true }, categoriesObject);
    })
    return categoriesObject;
}