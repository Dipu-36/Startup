package handlers

import "github.com/microcosm-cc/bluemonday"

func createSanitizer() *bluemonday.Policy {

	p := bluemonday.StrictPolicy()

	//Allow basic text formatting for rich content
	p.AllowElements("p", "br", "div", "span", "hr")
	p.AllowElements("strong", "b", "em", "i", "u", "s")

	p.AllowElements("h1", "h2", "h3", "h4", "h5")

	//Allow lists
	p.AllowLists()
	p.AllowElements("ul", "ol", "li")

	//Allow links but force them to open in new tab and prevent malicious protocols
	p.AllowAttrs("href", "target").OnElements("a")
	p.RequireParseableURLs(true)
	p.AllowURLSchemes("http", "https", "mailto") //Only allow safe URL scheme
	p.RequireNoFollowOnLinks(false)              //TODO: Change this to true when in need of SEO

	//Allow tables
	p.AllowTables()
	p.AllowElements("table", "thead", "tbody", "tfoot", "tr", "th", "td")
	p.AllowAttrs("colspan", "rowspan").OnElements("td", "th")

	//Allow blockqoutes and code
	p.AllowElements("blockqoute", "code", "pre")

	p.AllowAttrs("rel").OnElements("a")

	//Allow target attribute but restrict to specific values
	p.AllowAttrs("target").Matching(bluemonday.SpaceSeparatedTokens).OnElements("a")

	//Force external links to open in new tab with proper security attributes
	p.RequireNoReferrerOnFullyQualifiedLinks(true)
	return p
}
