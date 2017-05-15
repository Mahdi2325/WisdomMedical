function Pager(id, curPage, pageCount, fnClickOn) {
    this.CurrentPage = 1;
    this.Template = '{{#_hasPaging}}<nav><ul class="pagination"><li class="{{^_prevPage}}disabled{{/_prevPage}}"><{{#_prevpage}}span{{/_prevpage}}{{^_prevpage}}span{{/_prevpage}} href="{{_link}}{{_prevPage}}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></{{#_prevpage}}span{{/_prevpage}}{{^_prevpage}}span{{/_prevpage}}></li>{{^_isFirstPage}}<li><span href="{{_link}}1" class="paging-item">1</span></li>{{/_isFirstPage}}{{#_hasBeforePages}}<li><span>...</span></li>{{/_hasBeforePages}}{{#_beforePages}}<li><span href="{{_link}}{{.}}">{{.}}</span></li>{{/_beforePages}}<li class="active"><span href="{{_link}}{{_currentPage}}">{{_currentPage}}</span></li>{{#_afterPages}}<li><span href="{{_link}}{{.}}">{{.}}</span></li>{{/_afterPages}}{{#_hasAfterPages}}<li><span>...</span></li>{{/_hasAfterPages}}{{^_isLastPage}}<li><span href="{{_link}}{{_pageCount}}">{{_pageCount}}</span></li>{{/_isLastPage}}<li class="{{^_nextPage}}disabled{{/_nextPage}}"><{{#_nextpage}}span{{/_nextpage}}{{^_nextpage}}span{{/_nextpage}} aria-label="Next" href="{{_link}}{{_nextPage}}"><span aria-hidden="true">&raquo;</span></{{#_nextpage}}span{{/_nextpage}}{{^_nextpage}}span{{/_nextpage}}> </li> </ul> </nav> {{/_hasPaging}}';
    this.CurrentPage = 1;
    var html = Paging.render({
        currentPage: curPage,
        pageCount: pageCount,
        link: '#',
        template: this.Template
    });
    var $elem;
    if (typeof (id) == "string")
        $elem = $('#' + id);
    else
        $elem = id;
    $elem.html(html);
    $elem.find('.pagination>li>a').attr('href', '#');
    $elem.find('.pagination>li').each(function () {
        if (!$(this).is('.disabled') && !$(this).is('.active')) {
            //$(this).find('span[href]').click(function () {
            //    this.CurrentPage = $(this).text();
            //    fnClickOn(this.CurrentPage);
            //});
            $(this).find('span').css('cursor', 'pointer');
            $(this).find('span[href]').click(function () {
                this.CurrentPage = $(this).attr('href').substring(1);
                fnClickOn(this.CurrentPage);
            });
        }
    });
}