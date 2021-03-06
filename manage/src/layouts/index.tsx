import React, { useMemo, useCallback } from 'react'
import { connect } from 'umi'
import { ConfigProvider, Layout } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

import { IntlProvider, createIntl, createIntlCache } from 'react-intl'
import en_US from '@/locales/en'
import zh_CN from '@/locales/zh'

import { ConnectState } from '@/models/connect'
import { IntlContext } from '@/utils/context/intl'
import Header from './header'
import Sider from './sider'
import Footer from './footer'

import styles from './index.less'

const cache = createIntlCache()

interface BasicLayoutProps {
  // eslint-disable-next-line no-undef
  children: JSX.Element
  location: any
  lang: string
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children, location, lang }) => {
  const getLocale: (lang: string, type: string) => any = useCallback((lang, type) => {
    let language = null
    switch (lang) {
    case 'zh-cn':
      language = type === 'antd' ? zhCN : zh_CN
      break
    case 'en':
      language = type === 'antd' ? enUS : en_US
      break
    }
    return language
  }, [])

  // react-intl
  const intl = useMemo(() => createIntl(
    {
      locale: lang,
      messages: getLocale(lang, 'react-intl'),
    },
    cache,
  ), [lang])

  const formatMsg: (id: string, defaultMsg?: string) => any = useCallback((id, defaultMsg) => intl.formatMessage(
    {
      id,
      defaultMessage: defaultMsg || id,
    },
  ), [intl.locale])

  return (
    <IntlProvider messages={getLocale(lang, 'react-intl')} locale={lang}>
      <ConfigProvider locale={getLocale(lang, 'antd')}>
        <IntlContext.Provider value={formatMsg}>
          {location.pathname.startsWith('/user')
            ? (
              <React.Fragment>
                {children}
              </React.Fragment>
            )
            : (
              <Layout className={styles.basicLayout}>
                <Sider location={location} />
                <Layout className={styles.contentLayout}>
                  <Header />
                  <Layout.Content className={styles.content}>
                    {children}
                  </Layout.Content>
                  <Footer />
                </Layout>
              </Layout>
            )}
        </IntlContext.Provider>
      </ConfigProvider>
    </IntlProvider>
  )
}

export default connect(({ user }: ConnectState) => ({
  lang: user.lang,
}))(BasicLayout)
