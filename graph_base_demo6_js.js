// CPCS 324 Algorithms & Data Structures 2
// Graph Data Structure Demo - Reorganized Final Version
// 2013, Kawthar Al-Harbi, 0932608, AAR
//   15.js
//	Dear Dr, I have uploaded the exercise on Sunday, January 12, 2014 but, it was missing (a correct implementation of) method no. 2 of prim
//	please forgive me for uploading it again.. I didn't want to miss such a necessary  topic in the subject such as an efficient implementation of Prim,,,
//	and I hope you forgive me for asking this.. as I didn't want my final submission to be messing and  not indicative of my hard work in the subject ><
// thank you very much
//		
// 


var _v = [],
    _e = []; // globals used by standard graph reader method
var pushIndex = 0; //used to store index of push_stack
var count = 0,
    top = -1; //count is used to count pieces in graph. , top is used to store the stack values
var _popIndex = 0;
var _stack = [];
var T; // we will use this as a global variable to store the result of Floyd's algorithm
var _w; // we will use this as a global variable to store the weight matrix. 
var _M; // Use it to store adjacency matrix.
var _WR = [],
    _edgevisited = 0; // we use it to make warshals algorithm
var _weight = new Array();
_weight[0] = new Array();

var BFSpush = new Array(),
    indd = 0;
// -----------------------------------------------------------------------
// graph caller function - sort of main() for caller page
// called directly, or on load success event of some input file

function main_graph()
{


    // create a graph (default undirected)
    var g = new Graph();

    // set properties
    g.label = _graph_label;

    // if g is directed (digraph) change property BEFORE input
    //  g.digraph = true;

    // use global input arrays _v and _e to initialize its internal data structures
    g.read_graph(_v, _e);

    // use print_graph() method to check graph
    g.print_graph();

    // perform depth-first search and output stored result
    g.DFS();

    g.pushprint();
    document.write("<p> DFS push ", g.dfs_push, "</p>");
   
	 document.write("<p> BFS push:");
    g.BFS(); // calling the BFS
   

    g.createAdjacencyM(); // creating the adjacency matrix of graph g
    _M = g.adjacencyMat; // we stored the adjacency matrix in global variable to retrieve it later for printing.
	    document.write("<br>Adjacency Matrix: ");
   globalPrint(g.adjacencyMat);
   document.write("<br>");
    g.conect();
    g.isCyclic();
    
    document.write("<p> DFS POP ", g.dfsPop, "</p>");
 
   floyd(g.weight); // assign the return value of floyd's algorithm to the global variable T to show it later in a special print method 


  
    g.DFS_transitive();
    document.write("<p> DFS transitive closure ");
	  globalPrint(g.transitive);
   /* document.write("Adjacency Matrix: ");
    g.printMatrix(g.adjacencyMat);*/
    //	alert(_stack);
    g.printFloyd();
  /*  document.write("<BR><BR>  weight: ");
    globalPrint(_weight);*/
    document.write("<BR><BR> g.weight: ");
    //printing the weight
    globalPrint(g.weight);

    _M = g.adjacencyMat;
    document.write("<BR><BR> Warsahl Result: ");
    globalPrint(_WR);
    document.write("<BR><BR>*** </BR>");
    g.prim();

	g.prim2();

}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
    // user input fields

    this.label = v.label; // vertex can have label, example: a, v1, jeddah

    // more fields to initialize internally

    this.visit = false; // vertex can be marked visited (useful for traversals)
    this.adjacent = new List(); // head pointer of adjacency linked list
    this.count = 0; 
	this.parent= null;  
	this.minweight = Infinity;
  
}

function Edge(to, item)
{

// this function receives the second vertix v, and the weight


    this.to = to; // v is the second object; the destination of the edge or the second edge
    this.w = item;
    //if (e.w)
   this.visit= false;
   this.from; // it will get set in the add_edge function;


}
// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
    this.vert = new Array(); // vertex list: array of Vertex objects
    this.nv; // number of vertices
    this.ne; // number of edges
    this.weight = new Array(); // to store the weight
    this.dfs_push = []; // DFS traversal order output array
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.label = ""; // identification string to label graph
    this.connected = -1; //‐1 (to  signal invalid information), otherwise number of connected pieces
    this.transitive = []; // creating a 2D array to store a transitive closure matrix
    this.adjacencyMat = new Array();
    this.dfsPop = [];
    this.edgelist = new Array();
    this.warshall = new Array(); // array to store warshall's algorithm result
    this.FD = new Array(); // array to store floyd's algorithm 
    this.FD[0] = new Array();
    this.cycles = 0; // to count the cycles of a graph (will be used in DFS function
    this.acyclic = -1; // this is the property asked to do in project 1 checklist no. 4
    this.edgevisited = 0; // we will use this count to store the number of edges visited in DFS and compare it later with the number of vertices already in graph
    this.queue= new Queue();
	this.primVtree= new Array(); // variable to store prim minimum spanning tree
	// --------------------
    // student property fields next
    //	this.makeWeight= makeWeight;

    // --------------------
    // member methods use functions defined below

    this.read_graph = better_input; // default input reader method   

    this.add_edge = add_edge;
    this.print_graph = print_graph;
    this.list_vert = list_vert;
   
    //	this.list_edges=list_edges;
    // --------------------
    // student methods next; actual functions in student code section at end    
	this.printMatrix = printMatrix;
	this.createAdjacencyM = createAdjacencyM;
    this.printFloyd = printFloyd;
    this.DFS = DFS;
    this.dfs = dfs;
    this.BFS = BFS;
    this.bfs = bfs;
    this.DFS_transitive = DFS_transitive;
    this.dfs_transitive = dfs_transitive;
    this.conect = conect;
    this.pushprint = pushprint;
    this.popprint = popprint;
    this.push = push;
    this.pop = pop;
    this.isCyclic = cylceCount2;
    //this.cylceCount2 = cylceCount2;
    this.prim = prim;
	this.prim2= prim2;
	this.findmin=findmin;
    this.fillWeight = fillWeight;

    //  this.DFS_transitive_call = DFS_transitive_call;
}




function printMatrix(M)
{

    for (var i = 0; i < this.adjacencyMat.length; i++)
    {
        document.write("<br>", "{");
        for (var j = 0; j < this.adjacencyMat.length; j++)
         {   document.write(M[i][j], ",");
			}
        document.write("}");
    }
    document.write("<p>");



}


function globalPrint(item)
{
    // function to print anything in the form of matrix 
   
    for (var i = 0; i < item.length; i++)
    {
        document.write("<BR>", "{");
        for (var j = 0; j < item.length; j++)
         {   document.write(item[i][j], ",");}
        document.write("}");
    }

}

function printFloyd()
{
    if (this.weight[0][0] == NaN)
        {return; //return if the weight undefined
		}
    document.write("<BR>", "Floyd's distance of the shortest paths: ");

    for (var i = 0; i < this.weight.length; i++)
    {
        document.write("<BR>", "{");
        for (var j = 0; j < this.weight.length; j++)
          {  document.write(T[i][j], ",");}
        document.write("}");
    }
    document.write("</BR>");

}

function prim2() {
//initiaizing the queue;
   	 document.write("<p> Prim2 output: ");
var q= new PQueueMin();
var w= new Array(); // variable to store weights
var v= new Array(); // variable to store vertices ((((by index))))!
var indt =0; //variable used to store index of tree 
   for (var i = 0; i < this.nv; i++)
    { // This "for loop" to initialize vertex's visit with false
        this.vert[i].visit = false; 
		this.vert[i].parent= null;
		this.vert[i].minweight= Infinity; // setting the menweght again as Infnity since we have changed it after applying prim1
	
		}
		this.vert[0].visit= true; // visited first vertex
var temp= this.vert[0].adjacent.traverse(); // store array of adjacent
for( i= 0; i<temp.length; i++){
w[i]= temp[i].w; // store weight of adjacent

v[i]= temp[i].to; // store the indices of adjacent
}
q.insertSet(v, w);
var Vt= new Array(); // V-tree
Vt[0] = this.vert[0]; // v[0] is the first node
 document.write("<p> vertex: ",Vt[indt].label, " parent: ", Vt[indt].parent);
var u= q.deletMin(); 

this.vert[u[0]].visit=true;
this.vert[u[0]].parent=Vt[0]; // store parent
this.vert[u[0]].minweight=u[1]; // store minweight
indt++; // prepare for adding new vertex to our Vtree
Vt[indt]= this.vert[u[0]]; // store u

 document.write("<p> vertex: ",Vt[indt].label,  " parent: ", Vt[indt].parent.label, " Edge weight: " , Vt[indt].minweight );

var Et= new Array(); // E-tree

for (i=1; i<this.nv; i++){
q= new PQueueMin(); // initialize q again
 temp= Vt[indt].adjacent.traverse(); // store array of adjacent
 //var wu= new Array(), vu=new Array();
for( var s= 0; s<temp.length; s++){
w[s]= temp[s].w; // store weight of adjacent
v[s]= temp[s].to; // store the indices of adjacent
if(this.vert[temp[s].to].minweight> temp[s].w)
{
this.vert[temp[s].to].minweight= temp[s].w;
this.vert[temp[s].to].parent=Vt[indt]; 
}
}
q.insertSet(v,w); // insert adjacenies and weights of last Vtree vertex
 u= q.deletMin();
 if(this.vert[u[0]].visit===true)
 {u= q.deletMin();} 
// this.vert[u[0]].parent=Vt[indt]; // store parent
indt++;// prepare to add new vertex to our Vtree
Vt[indt]= this.vert[u[0]]; // store u
this.vert[u[0]].visit=true; // mark u as visited in graph
//this.vert[u[0]].minweight=u[1]; // store minweight

document.write("<p> vertex: ",Vt[indt].label, " parent: ", Vt[indt].parent.label, " Edge weight: " , Vt[indt].minweight );

if(Vt.length==this.nv){

break; }
//Et[indx]=
}


}
function prim()
{
    var Vt = new Array(),
        Et = new Array(),
        indx = 0,
        indt = 0, l=0;
   var parent;
   	 document.write("<p> Prim's output: ");
    for (var i = 0; i < this.nv; i++)
    { // This "for loop" to initialize vertex's visit with false
        this.vert[i].visit = false; 
		}
		this.vert[0].visit=true; // set "a" as visited
	 Vt[indt] = this.vert[0]; // Vt is the first vertex 0 , "a"
	 document.write("<p> vertex: ",Vt[indt].label , " parent: ", Vt[indt].parent);

	 indt++;
   this.vert[0].visit= true; 
var arrvertx=this.vert[0].adjacent.traverse();  // store a list of vertices that are adjacent to first vertex
//alert("arrvertex[0]: ",arrvertx[0]);

var sl= findmin(0,arrvertx);
l= sl[0]; // l will hold the index of the least edge vertex
//alert("l value: " ,l);
this.vert[l].visit=true; // set the edge with the least weight visited.
this.vert[l].parent=this.vert[0]; //  0 is the parent of this node now;
this.vert[l].minweight=sl[1];// store the weight of its edge
Vt[indt]=this.vert[l];
 document.write("<p> vertex: ",Vt[indt].label,  " parent: ", Vt[indt].parent.label, " Edge weight: " , Vt[indt].minweight );
for(var f=0; f<this.edgelist.length; f++){
if(this.edgelist[f].to==arrvertx[l].to && this.edgelist[f].w==arrvertx[l].w)
{this.edgelist[f].visit=true; // the edge with the least weight becomes visited, later only edges that are visited will be stored to the MSP
}} 
Et[0]= arrvertx[sl[2]]; // the edge in the index [stored in sl[2], is stored as and edge in our spanning tree
for (var g=0; g<arrvertx.length; g++){ 
// pass through adjacent vertices of a, set a as the parent of these edges, 
//and the weight of the edge from a to these edges as the minimum weight for it
this.vert[arrvertx[g].to].parent=this.vert[0];//  0 is the parent of this node now;
this.vert[arrvertx[g].to].minweight=arrvertx[g].w;// store the weight of its edge with 0

}
//Et[0].vert=l; 
for(var r=1; r<this.nv; r++){
var temp= Vt[indt].adjacent.traverse();
 
for (var h=0; h<temp.length; h++){
if(this.vert[temp[h].to].minweight> temp[h].w)
{ if(this.vert[temp[h].to].visit===false)// change value only if not visited before
{this.vert[temp[h].to].parent=Vt[r];
 this.vert[temp[h].to].minweight= temp[h].w; //set a new minimum weight newly discovered to the vertex info.}
}}
if(this.vert[temp[h].to].visit===true){
temp[h].visit=true;
}

//}

}
 sl= findmin(Vt[indt].count, temp); //send a vertex index
l= sl[0];
if(this.vert[l].visit===false && this.vert[l].minweight>sl[1]){

this.vert[l].parent=this.vert[r]; //  r is the parent of this node now;
this.vert[l].minweight=sl[1];// store the weight of its edge
}
this.vert[l].visit=true; // set the edge with the least weight visited.
indt++;
Vt[indt]= this.vert[l]; // push into v tree
document.write("<p> vertex: ",Vt[indt].label,  " parent: ", Vt[indt].parent.label, " Edge weight: " , Vt[indt].minweight );
if(indt+1==this.nv)
{
break; // break loop if we collected our vertices
}


}
this.primVtree= Vt; // store the v-tree to our graph
document.write("<p>");
}
	


function findmin(v,item){
var minweightEdge =Infinity; // variable to store the minimum weight edge among adjacent edges, initially infinity
var l= new Array(); // to save the index of the minimium edge related vertex
for (var t= 0; t<item.length; t++){

if(minweightEdge>=item[t].w && item[t].visit===false){
minweightEdge= item[t].w;
l[0]=item[t].to; //l[0] save the index of vertex
l[1]= item[t].w; // l[1] save the weight of the edge
l[2]=t; //store the index of the least-weight edge
}
if(item[t].weight<minweightEdge[t]){
item[t].parent=v; // set the parent of all adjacent vertices as their parent, v
item[t].newweight=item[t].w;
}
}

return l; //return the index of the vertex with minimum weight
}
function add_edge(u_i, v_i, w_i)
{ //w_i uses the weight of the vertix on the edge vertex
    // fetch vertices using their id
    var u = this.vert[u_i],
        v = this.vert[v_i];


	var e = new Edge(v_i);
	e.from=u_i; // we will store the vertex that the edge is coming from in here, I might use it later!
	if(!(w_i === undefined)) { e.w=w_i;}
    u.adjacent.insert(e); // insert (u,v) and weight as w_i attached to the edge , i.e., insert v (by id) in adjacency list of u 
     

    if (!this.digraph)
	{ e = new Edge(u_i);
	 if(!(w_i === undefined)) { e.w = w_i;}
        e.from=v_i; // we will store the vertex that the edge is coming from in here, I might use it later!
		v.adjacent.insert(e); // insert (v,u) for directed graph , weight is also attached to the edge.
		}
}

// --------------------
function print_graph()
{
    document.write("<p>GRAPH {", this.label, "} ", this.digraph ? "" : "UN", "DIRECTED - ", this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");
    this.list_vert();
    //	this.list_edges();
}

// --------------------
function list_vert()
{
    var i, v; // local vars
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
		var m = v.adjacent.traverse();// variable to store adjacency
		//alert("m.to: " ,m.to);
        document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit, " - ADJACENCY: ");
		for (var s=0; s<m.length; s++){ 
			if(s!==0){
			document.write(",");
			}
		  document.write(m[s].to); // storing the to vertices
		}
		   document.write("<p>");
    }
}

// --------------------
function better_input(v, e) // default graph input method
{
    this.nv = v.length; // note v,e here are local (passed parameters, not global input arrays)
    this.ne = e.length;



    for (var i = 0; i < this.nv; i++)
{        this.vert[i] = new Vertex(v[i]); // add new input vertex to internal vertex list
		this.vert[i].count=i; // safe the index of each vertex
}
    this.weight[0] = [];

    // the next two for loops is to initialize weight matrix with zeros and infinity as a default value

    this.fillWeight(this.nv); //fills weight with zeros and infinities initially 

    //var at =this.vert[v].adjacent.traverse();
    for (var j = 0; j < this.ne; j++)
    {
        var a = e[j].u,
            b = e[j].v;

        this.add_edge(e[j].u, e[j].v, e[j].w);
        this.edgelist[j] = new Array();
        this.edgelist[j] = new Edge(e[j].v, e[j].w);
		 _weight[e[j].u][e[j].v] = e[j].w;

        this.weight[e[j].u][e[j].v] = e[j].w;
		if(!this.digraph){
		 //  this.add_edge(e[j].v, e[j].u, e[j].w);
		this.weight[e[j].v][e[j].u] = e[j].w;
		 _weight[e[j].v][e[j].u] = e[j].w;
		 }
	

    }


    if (!this.digraph) { this.ne *= 2; // double edge count if graph undirected 
	
	}



}

// -----------------------------------------------------------------------
// utility functions used by Graph object method functions
function fillWeight(verticesNumber)
{
    for (var i = 0; i < verticesNumber; i++)
    {
        this.weight[i] = new Array();
        _weight[i] = new Array();

        for (var j = 0; j < verticesNumber; j++)
        {
            
                if (j == i)
                {
                    this.weight[i][j] = 0;
                    _weight[i][j] = 0;


                }
                else
                {
                    this.weight[i][j] = Infinity;
                    _weight[i][j] = Infinity;

                }
            

        }
    }


}

function old_input(v) // DON'T USE - to illustrate a point
{
    this.nv = v.length;
    this.ne = 0;

    var i;
    for (i = 0; i < this.nv; i++)
    {
        // add new input vertex to object vertex list
        this.vert[i] = new Vertex(v[i]);

        if (v[i].adj) // is true only if variable is assigned value
        {
            // if vertex has adjacent vertices then collect their id in array a, 
            // and insert the id in its adjacency list

            var a = v[i].adj.split("|"),
                m = a.length;
            for (var j = 0; j < m; j++)
            {
                this.vert[i].adjacent.insert(a[j]);

            }
            // update number of edges
            this.ne += m;
        }
    }
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------


function DFS_transitive()
{

    var i;
    for (i = 0; i < this.nv; i++)
    {
        this.transitive[i] = new Array(); // initiate 2D array
        for (var j = 0; j < this.nv; j++) // set its values to 0
           { this.transitive[i][j] = 0;}
    }

    for (i = 0; i < this.nv; i++) // to visit all vertices in connected graph
    {
        for (var k = 0; k < this.nv; k++) // for each vertex in graph
       {     this.vert[k].visit = false; //mark each vertex in V with false = unvisited 
	   }
        if (!this.vert[i].visit) //  go to dfs_transitive if unvisited
         {   this.dfs_transitive(i, this.vert[i]); // we call the method by index and vertex too
		 }
    }
}

// --------------------
function dfs_transitive(ind, v_i)
{
    var w = v_i.adjacent.traverse(); //w is the adjacent of v
    v_i.visit = true; //make it visited

    for (var j = 0; j < w.length; j++)
    {
        this.transitive[ind][w[j].to] = 1; // set transitive array at indices ind, w[j] to 1
        if (!this.vert[w[j].to].visit)
            {this.dfs_transitive(ind, this.vert[w[j].to]); //recursive by change the index of adjacent vert only. 
			}
    }

}


function createAdjacencyM()
{

   // var i, j, k, m; // local variables, i,j andk for loop
    for (i = 0; i < this.nv; i++) //for all vertices in the graph
    {
        this.adjacencyMat[i] = new Array(this.nv); //create  2d matrix.
        for (j = 0; j < this.nv; j++)
           { this.adjacencyMat[i][j] = 0; // initialize  adjacencyMat by zero
		   }
    }
    for (var k = 0; k < this.nv; k++) //for all v 
    {		
       var m = this.vert[k].adjacent.traverse(); //adjacency matrix 
	
		//alert("m.length: ", m.length);
        for (var i = 0; i < this.nv; i++)
           { for (var j = 0; j < m.length; j++)
              {  if (i == m[j].to) //checking for vertex adjacency 
                    {this.adjacencyMat[k][i] = 1;
					}
					}
					}
    }
}


function DFS()
{

    for (var i = 0; i < this.nv; i++)
    { // This "for loop" to initialize vertex's visit with false
        this.vert[i].visit = false;
    }
    this.connected++;
    this.acyclic = 0; //set cycles value of 0 as a beginning 
    this.edgevisited = 0; //set the count of edge visited as 0
    _edgevisited = 0;
    for (var j = 0; j < this.nv; j++)
    { // This "for loop" for visiting the vertex
        if (this.vert[j].visit === false)
        { //This means that the graph is not connected so we have to pop the vertices in this piece. first we pop the elements in this tree and then perform  dfs	

            // because in the initialization of the array we use this to assign this array for this object , we must use this to call it
			
            this.dfs(j);
            this.connected++;


        }

    }

}

function adjacentTraverse(item)
{
    //function to return adjacency of an item

    w = item.adjacent.traverse();
    return w;
}
// --------------------
function dfs(v_i)
{
    // -- Process Vertex
//alert("value of v_i: " , v_i);
    this.vert[v_i].visit = true;
		// alert( this.vert[v_i].visit);
    this.dfs_push[pushIndex] = this.vert[v_i].label;
    this.edgevisited++; //increment the count of edge visited
    _edgevisited++;
    pushIndex++;
    push(this.vert[v_i].label); //add an item to the stack and increase the stack top value

    _stack[top] = this.vert[v_i].label; //add an item to the stack and increase the stack top value
    top++;

    document.write("<br>" + this.vert[v_i].label + "  index " + v_i + " Visited: " + this.vert[v_i].visit); // this shows the vertex that is visited along with its index once it is visited
    // end of vertex process section
    //----- Processing Edge
    //---- to be added
    var w = new Array();
    //   w = this.vert[v_i].adjacent.traverse(); // to get the adjacent for current vertex , "the variable that you received is vi"
    //----- Processing traversal
    w = adjacentTraverse(this.vert[v_i]);
    // document.write("<br>"+ w); // I wrote this sentence to print  the current vertex being popped in the graph
    for (var i = 0; i < w.length; i++)
    {
  
        if (this.vert[w[i].to].visit === false) //if (this.vert[w[i].v].visit == false) تصير كذا بعد ما نخليه ادج أوبجكت
        {
			// w will return an array object not the element of the array , and by this way you will return 0,2,3 ...etc which mean the 
			//number of index of the adjacent vertex , so you can use this index to get the vertex form this.vert array
            this.dfs(w[i].to); // the id of the unvisited vertex

        }
    }
}

function BFS()
{
    for (var i = 0; i < this.nv; i++)
    { // This "for loop" to initialize vertex's visit with false
        this.vert[i].visit = false;
    }

    for (var j = 0; j < this.nv; j++)// for every vertix in g 
    { 
        if (this.vert[j].visit === false)
          { this.bfs(this.vert[j]); // perform bfs
		  }
    }

}

function bfs(v_i)
{
    
	v_i.visit = true;
	this.queue.enqueue(v_i);
	document.write(v_i.label);
	var vertex = v_i;
  
    while (!this.queue.isEmpty())
    {
		var w = vertex.adjacent.traverse();		
		var j=w.length;
        for (var i = 0; i <j; i++)
           { if (this.vert[w[i].to].visit === false)
            {
				this.queue.enqueue(this.vert[w[i].to]);
			
                this.vert[w[i].to].visit = true;
				document.write(this.vert[w[i].to].label);
            }
			}
      vertex=this.queue.dequeue();
	
    }
}


function push(val)
{

    top++;
    _stack[top] = val;
}

function pop()
{
    var m = _stack[top];
    top--;
    return m;
}
//*****
//----- Function to describe the connectivity of a graph
function conect()
{

    //function to check connectivity
    //not used: var numc=verlist.length; // variable to store the number of lists we made to store the connected vertices the length of verlist is used to indicate number of pieces because we used it inside the loop of DFS, if the loop breaks, it will make a new list with an increased index
    if (this.connected == 1)
    {
        document.write(" graph is connected and contains ", this.connected, "piece");
    }


    if (this.connected > 1)
    {
        document.write("<BR> Connectivity: <BR>The graph is not connected and contains ", this.connected, " pieces");
    }
}



function cylceCount2()
{
    // this is the doctor's cycling test
    document.write("<p> This is the class required acyclic testing:  ");
    if (this.digraph)
    {
        document.write(" graph is directed so the property of cyclic is undefined for now <p> ");
        return;
    }
    if (this.edgevisited  == this.ne)
    {
        document.write("<p> graph is acyclic <p> ");
    }
    else if (this.edgevisited < this.ne)
    {
        var a = (this.nv-1),
            b = this.edgevisited / 2;
        document.write("  graph is cyclic and contains  ", a - b, "cycles<p>");
    }
}



function floyd(item) // floyd-warshall
{
            //this 2 for loops to check whether there is an undefined weight in the graph, so, it will return from floyd's algorithm unharmed :D00
        for (var t=0; t < item.length; t++)
          {  for (var s; s < item.length; s++)
              {  if (item[t][s] == undefined)
                {

                    document.write("<BR>", "Floyd is un-applicable because the graph is un-weighted", "</BR>");
                    return; //return if the graph is unweighted.
                }
    
}}
    var D = new Array();
    D = item;
    _WR = _M; // make the global variable _WR for warshal as the adjacency marix.
    for (var k = 0; k < item.length; k++)
     {   for (var i = 0; i < item.length; i++)
         {   for (var j = 0; j < item.length; j++)
            {
                D[i][j] = Math.min(D[i][j], D[i][k] + D[k][j]);
                _WR[i][j] = _WR[i][j] | (_WR[i][k] & _WR[k][j]);
            }

		}
	}

	T=D; //the value of global variable T is set to be D
	this.FD= D; // the value of floyd is stored to the graph

}

function pushprint()
{
    document.write("<BR><BR> The graph vertices push in DFS order: ");
    for (var i = 0; i < this.dfs_push.length; i++)
    {
        document.write(this.dfs_push[i] + ",");
    }

}

function popprint()
{
    document.write("<BR> The graph vertices pop in DFS order: ");
    for (var i = 0; i < this.dfs_pop.length; i++)
    {
        document.write(this.dfs_pop[i] + ",");
    }

}

// CPCS 324 Algorithms & Data Structures 2
// Linked list data structure
// 2013, Dr. Muhammad Al-Hashimi


// -----------------------------------------------------------------------
// Linked list node object constructor (used for graph vertex adjacency node)

function LNode(item, wi)
{
	this.item = item;     // stored value in list
	this.next = null;
	this.weight=wi;
}

// -----------------------------------------------------------------------
// Linked list object constructor

function List()
{
	this.first = null;           // list initially empty

	// --------------------
	// many more list processing methods could be added here

	this.insert = insert;        // insert node at end of list
	this.traverse = traverse;    // return list elements in an array

	// student methods next; ; actual functions in student code section at end

}

// -----------------------------------------------------------------------
// method functions used by List() object
//

function insert(item,wi)   
{ 
	// if list empty create node and insert otherwise walk down list and insert at end
	
	if (this.first === null)
		{this.first = new LNode(item , wi); }
	else
	{
		var l = this.first;      // walker variable
		while (l.next !== null)
			{l = l.next;          // never assign a null pointer
			}
		l.next = new LNode(item , wi);
	}
}

// --------------------
function traverse()
{
	var out = [];  // return list elements in array

	for (var i=0, l=this.first; l !== null; l = l.next )
	{ var s= i;	
	out [s] = l.item;
	i++;
	}
	return out;
}
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------
// this function is addition for Queue use. It is used to know if it is Empty or not
function isEmpty(){

return this.first===null;
}

function PQueueMin(){
this.pq= new Heap(); // heap implementation

this.isEmpty = pqEmpty;  // return true if queue is empty
this.deletMin= pqDeleteMin;  // remove/ returm item with minimum priority
this.insert= pqInsertSetMin;  // insert an item with (min) priority
this.size = 0 ;
this.item= new Array();
this.prior= new Array();
this.insertSet=pqInsertSetMin;  // insert array of items with (min) priorities 

}


function pqEmpty(){

return this.size === 0;

}

function pqDeleteMin(){
var item= [-1, -1];
if(!this.isEmpty())
{
	item= this.pq.deleteRoot();
	item[1]*=-1; //flip sign ,,  min-hip stores negative priorety
}
return item;
/*item = heap[1];
this.heapDeleteRoot();
return item;
*/
}


function pqInsertItemMin(item, prior)
{
prior==-1;

this.pq.insertSet(item, prior);
}

function pqInsertSetMin(item, priorSet){
for (var i=0; i<priorSet.length; i++ )
	{	priorSet[i]*=-1;  // multiply its priority by -1 to make it less (counter the priority)
		}
this.size=priorSet.length;
this.pq.insertSet( item, priorSet);		
}


function Heap(){
// h[0] is not used, heap is initially empty
this.h=[null];			//keys of heap
this.h_item = [null];	// corresponding item heap (data, any object)
this.size=0;			// 1 smaller than array (also index of last child)

//-----------
//---- many more heap corresponding functions could be added here

this.isEmpty= hEmpty;			// return true if heap is empty
this.deleteRoot = heapDeleteRoot;
//this.insert = heapInsert;	//insert item with key

this.show= heapShow; 			//diagnostic: return as string pretty formatted heap
this.heapify= heapify;			// make subtree heap: top-down heapify("sink")
this.insertSet= heapBottomUp;	//insert array of item and keys keeping heap

//this reheapify= reheapify; 	//bottom-up reheapify ("swim")


//-------
//------ Student Functions
}

//method functions used by Heap() object

function hEmpty(){
return this.size===0;
}


function heapShow(){
var n= this.size;
var m= Math.floor(n/2); // the last parent node

var out = "<p>Heap (size = "+ n+ "):"+ this.h.slice(0,n+1)+ "<br>" + this.h_item.slice(0,n+1)+ "</p>";
for (var i =1 ; i<m; i++)
{
	out+= "<p>"+ i+ ": <b>"+ this.h[i]+ "(" +this.h_item[i]+ ")</b> <ul>";
	if(2*i<=n)
	{	out+= "<li>" + this.h[2*i]+ "</li>"; }
	if(2*i+1<=n)
	{	out+= "<li>" + this.h[2*i+1]+ "</li>";}
	out+="</ul></p>";

}

return out;
}

function heapDeleteRoot()
{
var root=[this.h[1],this.h_item[1]];		//return array [root key, root item]

//exchange root with last and reduce heap size by 1
this.h_item[1]=this.h_item[this.size];

this.h[1]=this.h[this.size];
this.size--;
//heapify smaller tree by sifting new root down
this.heapify(1);
return root;
/*
//root[1]=h[1] ; // root[1] is the root item 

h[1]= h[n]; // exchange root with the last item
h[n]= root[1] // assign the last item with the value of root
root[0]= n // root[0] is the root key
*/
}

//-------

function heapify(k){
var n=this.size;
var v=this.h[k], heap= false; //subtree parent key value. "heap" state
var v2= this.h_item[k];			//also save subtree parent item value
var j;

while (!heap && 2*k<=n)
{
	j=2*k;
	if(j<n)
	{
		if(this.h[j]<this.h[j+1]){
		j++;}
	}
	if (v>=this.h[j])
	{heap=true;}
	else
	{
		this.h[k]= this.h[j];
		this.h_item[k]=this.h_item[j];
		k=j;
		
		}

	this.h[k]= v; 
	this.h_item[k]=v2;
}

}

function heapBottomUp(keyset, itemset)
{
//append input dataset to heap after this.size not array
//so that insert works after deleteRoot
/*
this.h= this.h.splice(0,this.size+1); this.h_item= this.h_item.splice(0,this.size+1);
this.h= this.h.concat(keyset); this.h_item= this.h_item.concat(itemset);*/
this.size+=keyset.length;
var m=Math.floor(this.size/2); //last parent node
var k,v,j;
var heap= false;
for(var g=1 ; g<=keyset.length; g++ ){
this.h[g]=keyset[g-1];
this.h_item[g]= itemset[g-1];

}
var v2= this.h_item[1];			//also save subtree parent item value
for (var i=m ; i>0; i--)
{
k=i;
v=this.h[k];
while(heap===false&& 2*k<=this.size){
j=2*k;
if(j<this.size){
		if(this.h_item[j]<this.h_item[j+1]){
		j=j+1;}
		}
if(v2>=this.h_item[j]){
heap=true;
}
else{
this.h[k]= this.h[j];
this.h_item[k]= this.h_item[j];
k=j;
}
}
this.h[k]=v;
this.h_item[k]=v2;
//this.heapify(1);
}

}



// Queue Implementation
function Queue(){
var queue = [];
 
this.head = new List();
this.size=0;
this.isEmpty= qEmpty;
this.enqueue= enqueue;  //insert item att taile of Queue
this.dequeue=dequeue;   //remove item from the head of queue

}

// methods used by Queue() object

function qEmpty(){
// we use the function of list; because head is a List() object.
// the isEmpty is defined in the linklist file as List() object function
return this.head.first===null;

}

function enqueue(item){
this.head.insert(item);
this.size++;

}

function dequeue(){ // first swap , then delete 
var item = this.head.first.item;
this.head.first= this.head.first.next;
this.size--;
return item;
}