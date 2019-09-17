const path = require('path')
const siteConfig = require('../../site-config')
const { getPathByPageFactory } = require('../../common/routerHelper')
const pageUtils = require('../../common/pageUtils')

const postPerPage = siteConfig.postPerPage || 60

const getPath = getPathByPageFactory('articles')

const getTotalPages = async graphql => {
  const allMarkdownCount = await graphql(`
    {
      allMarkdownRemark(filter: { fields: { collection: { eq: "article" } } }) {
        totalCount
      }
    }
  `)
  return pageUtils.getTotalPages(
    allMarkdownCount.data.allMarkdownRemark.totalCount,
    postPerPage
  )
}

const createPageContext = (currentPage, totalPages) => ({
  totalPages,
  currentPage,
  pageSize: postPerPage,
  postsOffset: pageUtils.getPageElementOffset(currentPage, postPerPage),
  prevPath: getPath(currentPage - 1),
  nextPath: getPath(currentPage + 1),
  hasPrev: pageUtils.hasPrevPage(currentPage),
  hasNext: pageUtils.hasNextPage(currentPage, totalPages),
})

const createArticlesPage = ({ createPage, currentPage, totalPages }) => {
  createPage({
    path: getPath(currentPage),
    component: path.resolve(`./src/templates/ArticlesPageTemplate.js`),
    context: pageUtils.createPageContext({
      currentPage,
      totalPages,
      elementsPerPage: postPerPage,
      getPathByPage: getPath,
    }),
  })
}

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const totalPages = await getTotalPages(graphql)

  for (let i = 0; i < totalPages; i++) {
    createArticlesPage({ createPage, currentPage: i, totalPages })
  }
}

module.exports = createPages
