
var documents = [{
    "id": 0,
    "url": "https://awmatheson.github.io/404.html",
    "title": "",
    "body": " 404 Page not found :(  The requested page could not be found. "
    }, {
    "id": 1,
    "url": "https://awmatheson.github.io/about/",
    "title": "About Me",
    "body": " Born and Raised in Vancouver BC, I am an outdoor enthusiast and interested in the intersection between humanity and technology. I was educated in civil engineering after which I pursued a masters degree in management. As I was always interested in computers and helping people find solutions to problems, which led me to my current pursuits. I currently work @ GitHub in the Data Science org. I focus on building tools for data scientists and machine learning engineers for things from ML Ops to Notebook rendering. If you ever want to reach out with what you think would be an awesome tool GitHub could support or build for the Data Science community, feel free to reach out @MathesonZander on twitter. "
    }, {
    "id": 2,
    "url": "https://awmatheson.github.io/categories/",
    "title": "Tags",
    "body": "Contents: {% if site. categories. size &gt; 0 %} {% for category in site. categories %} {% capture category_name %}{{ category | first }}{% endcapture %} {{ category_name }}{% endfor %}{% endif %} {% for category in site. categories %}  {% capture category_name %}{{ category | first }}{% endcapture %} &lt;h3 id = {{ category_name }} &gt;&lt;i class= fas fa-tags category-tags-icon &gt;&lt;/i&gt;&lt;/i&gt; {{ category_name }}&lt;/h3&gt;&lt;a name= {{ category_name | slugize }} &gt;&lt;/a&gt;{% for post in site. categories[category_name] %}{%- assign date_format = site. minima. date_format | default:  %b %-d, %Y  -%}&lt;article class= archive-item &gt; &lt;p class= post-meta post-meta-title &gt;&lt;a class= page-meta  href= {{ site. baseurl }}{{ post. url }} &gt;{{post. title}}&lt;/a&gt; • {{ post. date | date: date_format }}&lt;/p&gt;&lt;/article&gt;{% endfor %} {% endfor %}"
    }, {
    "id": 3,
    "url": "https://awmatheson.github.io/images/copied_from_nb/",
    "title": "",
    "body": "WarningDo not manually save images into this folder. This is used by GitHub Actions to automatically copy images.  Any images you save into this folder could be deleted at build time. "
    }, {
    "id": 4,
    "url": "https://awmatheson.github.io/jupyter/2020/03/13/boston-growth.html",
    "title": "Boston COVID19",
    "body": "2020/03/13 -           Context : Recently Boston became a COVID19 hotspot due to an outbreak occurring at biogen. This happens to be a company located approximately 2 blocks from my apartment. We share restaurants, transit hubs and more. Since this hits a little close to home, I wanted to take a look at the suspected growth rate for the total possible number of infected people in the boston area. To do this, we will use the SIR model and we can also create a forecasting model using prophet to track the predicted vs. actual.              #collapse-hideimport pandas as pdimport numpy as npimport matplotlib. pyplot as pltimport seaborn as snsimport matplotlib. dates as mdatesfrom sklearn. cluster import KMeansimport datetimefrom datetime import date, timedeltafrom fbprophet import Prophetfrom datetime import datetimeimport requestsfrom io import StringIO             bytes_csv = str(requests. get(&quot;https://raw. githubusercontent. com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed. csv&quot;, allow_redirects=True). content,&#39;utf-8&#39;)data = StringIO(bytes_csv) df=pd. read_csv(data, parse_dates=True)df. dropna(inplace=True)df = df[df[&#39;Province/State&#39;]. str. contains(&#39;Massachusetts&#39;)]. iloc[:,4:]. copy(). Tdf. columns = [&#39;Confirmed&#39;]          df[&#39;Date&#39;] = df. indexdf[&#39;Date&#39;] = df[&#39;Date&#39;]. apply(lambda x: datetime. strptime(x, &#39;%m/%d/%y&#39;))df. set_index(&#39;Date&#39;,inplace=True)          df. tail()           Confirmed       Date            2020-03-08   0       2020-03-09   0       2020-03-10   92       2020-03-11   95       2020-03-12   108     Modeling the growth of a region : Since we don't have a lot of data for Boston, we can use SIR as a model to estimate the growth in the area. We will make some assumptions around the population because it is most likely feasible that only certain mobile areas of the greater boston population would be affected. In addition, since schools have closed and work from home is already mandated, we can probably further reduce our contact rate to the lower of the range shown for the coronavirus.       population = 4875390saturation_coeff = . 6 # estimated possible population saturationdensity_coeff=. 5 # 1/2 of wuhan density    Using the SIR model to determine growth recovery rate, gamma = 1/5 - 1 person takes on average 5 days to pass through the contagious stage 1contact rate, beta = . 475 - This is difficult because it varies over time 2. This complicates things, since the early contact rate could be up to 10, but will decrease as restrictions are placed on the population, people self-isolate etc. For this estimation we will assume a contact rate of 0. 5 after fitting the SIR to the Italy EDA I previously completed here. Approximately 15% of cases require hospitalization based on the China outbreak and 5% require ICU treatment 3Massachusetts has 15,193 beds available and approximately operate at 50% capacity - leaving ~7597 beds. 4population adjusted is based on the estimation that sparser populated areas do not have as high of transmission rates and can be fairly isolated from the rest of the population.              #collapse-showimport numpy as npfrom scipy. integrate import odeintimport matplotlib. pyplot as plt# Total population adjusted for assumptions listed aboveN = population * saturation_coeff * density_coeffhosp_rate= 0. 15# Initial number of infected and recovered individuals, I0 and R0. I0, R0 = 91, 1# Everyone else, S0, is susceptible to infection initially. S0 = N - I0 - R0# Contact rate, beta, and mean recovery rate, gamma, (in 1/days). beta, gamma = 0. 475, 1/5 # A grid of time points (in days)t = np. linspace(0, 160, 160)# The SIR model differential equations. def deriv(y, t, N, beta, gamma):  S, I, R = y  dSdt = -beta * S * I / N  dIdt = beta * S * I / N - gamma * I  dRdt = gamma * I  return dSdt, dIdt, dRdt# Initial conditions vectory0 = S0, I0, R0# Integrate the SIR equations over the time grid, t. ret = odeint(deriv, y0, t, args=(N, beta, gamma))S, I, R = ret. TH = I*hosp_ratebeds = np. array([7597 for i in range(len(H))])# Plot the data on three separate curves for S(t), I(t) and R(t)fig = plt. figure(facecolor=&#39;w&#39;, figsize= (14,10))ax = fig. add_subplot(111, axisbelow=True)ax. plot(t, S/100000, &#39;b&#39;, alpha=0. 5, lw=2, label=&#39;Susceptible&#39;)ax. plot(t, I/100000, &#39;r&#39;, alpha=0. 5, lw=2, label=&#39;Infected&#39;)ax. plot(t, R/100000, &#39;g&#39;, alpha=0. 5, lw=2, label=&#39;Recovered with immunity&#39;)ax. plot(t, H/100000, &#39;y&#39;, alpha=0. 5, lw=2, label=&#39;Hospitalized&#39;)ax. plot(t, beds/100000, &#39;m&#39;, alpha=0. 5, lw=2, label=&#39;Bed Capacity&#39;)ax. set_xlabel(&#39;Time /days&#39;)ax. set_ylabel(&#39;Number (100000s)&#39;)ax. set_ylim(0,12)ax. set_xlim(0,60)ax. yaxis. set_tick_params(length=0)ax. xaxis. set_tick_params(length=0)ax. grid(b=True, which=&#39;major&#39;, c=&#39;w&#39;, lw=2, ls=&#39;-&#39;)legend = ax. legend()legend. get_frame(). set_alpha(0. 5)for spine in (&#39;top&#39;, &#39;right&#39;, &#39;bottom&#39;, &#39;left&#39;):  ax. spines[spine]. set_visible(False)plt. show()print(&quot;targeted population in this model: {}&quot;. format(N))print(&quot;critical infected population at inflection point: {}&quot;. format(I. max()))print(&quot;critical hospitalized population: {}&quot;. format(I. max()*hosp_rate))     targeted population in this model: 1462617. 0critical infected population at inflection point: 314103. 19593972364critical hospitalized population: 47115. 47939095854  We can observe that with this SIR model we could see approximately 314,000 infected people and 47,115 people requiring hospitalization. We will run out of bed capacity eventually, which is the situation that happened in Italy. Without the ability to build massize isolated treatment centers like china did, there are not many options for creating hospitals that will have the necessary treatment capabilities for the virus. Lets zoom in on the capacity below.       # Zooming infig = plt. figure(facecolor=&#39;w&#39;, figsize= (14,10))ax = fig. add_subplot(111, axisbelow=True)ax. plot(t, H/1000, &#39;y&#39;, alpha=0. 5, lw=2, label=&#39;Hospitalized&#39;)ax. plot(t, beds/1000, &#39;m&#39;, alpha=0. 5, lw=2, label=&#39;Bed Capacity&#39;)ax. text(t[23], 8, &quot;Hospital Saturation&quot;, ha=&#39;center&#39;)ax. set_xlabel(&#39;Time /days&#39;)ax. set_ylabel(&#39;Number (1000s)&#39;)ax. set_ylim(0,70)ax. set_xlim(0,60)ax. yaxis. set_tick_params(length=0)ax. xaxis. set_tick_params(length=0)ax. grid(b=True, which=&#39;major&#39;, c=&#39;w&#39;, lw=2, ls=&#39;-&#39;)legend = ax. legend()legend. get_frame(). set_alpha(0. 5)for spine in (&#39;top&#39;, &#39;right&#39;, &#39;bottom&#39;, &#39;left&#39;):  ax. spines[spine]. set_visible(False)plt. show()    Conclusion : The visualization above shows that approximately 23-25 days after the initial group of patients tested positive, we could reach hospital bed saturation for Massachusetts based off of the greater boston population (adjusted) being infected by the virus. This could cause a change in the contact rate that we assumed for our model and increase the infected patients. Based on this analysis, we could see deaths into the 10s of thousands in the next few months depending on the demographics of the population infected. References : https://scipython. com/book/chapter-8-scipy/additional-examples/the-sir-epidemic-model/https://www. sciencedirect. com/science/article/pii/S246804272030004Xhttps://www. bphc. org/healthdata/other-reports/Documents/Healthcare%20Access%20Report%20FINAL. pdfhttps://www. cdc. gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients. htmlhttps://www. ahd. com/states/hospital_MA. html"
    }];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')
    this.metadataWhitelist = ['position']

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if(term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}