import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import Header from './Header'
import styles from './Layout.module.scss'
import Footer from './Footer'
import classnames from 'classnames'
import ProgressBarStyle from './ProgressBarStyle'

const Layout = ({ children, className }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          author
          source
          headerLinks {
            name
            path
          }
        }
      }
    }
  `)

  const { siteMetadata } = data.site

  return (
    <>
      <ProgressBarStyle />
      <div className={styles.flexWrapper}>
        <Header
          title={siteMetadata.title}
          headerLinks={siteMetadata.headerLinks}
        />
        <div className={classnames(styles.mainWrapper, className)}>
          <main>{children}</main>
        </div>
        <Footer author={siteMetadata.author} source={siteMetadata.source} />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

Layout.defaultProps = {
  className: 'site-main',
}

export default Layout
