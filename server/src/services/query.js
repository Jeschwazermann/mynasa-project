const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
// const DEFAULT_PAGE_LIMIT = 1;
// const DEFAULT_PAGE_NUMBER = 1;

// function getPagination(query) {
//   const page = Math.max(
//     DEFAULT_PAGE_NUMBER,
//     Math.abs(query.page) || DEFAULT_PAGE_NUMBER
//   );
//   const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
//   const skip = (page - 1) * limit;

//   return {
//     skip,
//     limit,
//   };
// }

// module.exports = {
//   getPagination,
// };
