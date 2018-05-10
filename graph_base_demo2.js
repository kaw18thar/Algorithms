// CPCS 324 Algorithms & Data Structures 2
// Graph Data Structure Demo - Reorganized Final Version
// 2013, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge property fields to be added later as needed
//

var _v=[], _e=[];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// graph caller function - sort of main() for caller page
// called directly, or on load success event of some input file

function main_graph()   
{
    // create a graph (default undirected)
    var g = new Graph();
    
    // set properties
    g.label = "Figure 3.10 (Levitin, 3rd edition)";
    
    // if g is directed (digraph) change property BEFORE input
    // g.digraph = true;
    
    // use global input arrays _v and _e to initialize its internal data structures
    g.read_graph(_v,_e);
    
    // use print_graph() method to check graph
    g.print_graph();
    
    // perform depth-first search and output stored result
    g.DFS();
    document.write("<p>",g.dfs_push,"</p>");
}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
	// user input fields
	
	this.label = v.label;          // vertex can have label, example: a, v1, jeddah
	
	// more fields to initialize internally
	
	this.visit = false;            // vertex can be marked visited (useful for traversals)
	this.adjacent = new List();    // head pointer of adjacency linked list
}

// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
	this.vert = new Array();       // vertex list: array of Vertex objects
	this.nv;                       // number of vertices
	this.ne;                       // number of edges
	this.dfs_push = [];            // DFS traversal order output array
	this.digraph = false;          // true if digraph, false otherwise (default undirected)
	this.label = "";               // identification string to label graph
	
	// --------------------
	// student property fields next
	
	
	// --------------------
	// member methods use functions defined below
	
	this.read_graph=better_input;  // default input reader method   
	
	this.add_edge = add_edge;
	this.print_graph = print_graph;
	this.list_vert = list_vert;
	
	// --------------------
	// student methods next; actual functions in student code section at end
	
	this.DFS = DFS;
	this.dfs = dfs;
}


// -----------------------------------------------------------------------
// method functions used by Graph object
// similar to other functions but use object member fields and methods depending
// on which object is passed by method call through "this"
//

function add_edge(u_i,v_i)
{
	// fetch vertices using their id
	var u = this.vert[u_i], v = this.vert[v_i];
	
	u.adjacent.insert(v_i);      // insert (u,v), i.e., insert v (by id) in adjacency list of u
	if ( ! this.digraph )
		v.adjacent.insert(u_i);  // insert (v,u) for undirected graph
}

// --------------------
function print_graph()
{
	document.write("<p>GRAPH {",this.label, "} ", this.digraph?"":"UN", "DIRECTED - ", this.nv, " VERTICES, ", 
		this.ne, " EDGES:</p>");
	this.list_vert();
}

// --------------------
function list_vert()
{
	var i, v;                     // local vars
	for (i=0; i < this.nv; i++)
	{
		v = this.vert[i];
		document.write( "VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit, 
			" - ADJACENCY: ", v.adjacent.traverse(), "<br>" );
	}
}

// --------------------
function better_input(v,e)     // default graph input method
{
	this.nv = v.length;  // note v,e here are local (passed parameters, not global input arrays)
	this.ne = e.length;

	var i;

	for (i=0; i < this.nv; i++)
		this.vert[i] = new Vertex( v[i] );  // add new input vertex to internal vertex list
	
	for (i=0; i < this.ne; i++)
		this.add_edge(e[i].u, e[i].v);

	if ( ! this.digraph ) this.ne *= 2;     // double edge count if graph undirected 
}

// -----------------------------------------------------------------------
// utility functions used by Graph object method functions

function old_input(v)  // DON'T USE - to illustrate a point
{
	this.nv = v.length;
	this.ne = 0;
	
	var i;
	for (i=0; i < this.nv; i++)
	{
		// add new input vertex to object vertex list
		this.vert[i] = new Vertex( v[i] );
		
		if ( v[i].adj )          // is true only if variable is assigned value
		{
			// if vertex has adjacent vertices then collect their id in array a, 
			// and insert the id in its adjacency list
			
			var a = v[i].adj.split("|"), m=a.length; 
			for (var j=0; j<m; j++)
				this.vert[i].adjacent.insert(a[j]);
				
			// update number of edges
			this.ne += m;
		}
	}
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------


function DFS()
{

}

// --------------------
function dfs(v_i)
{
	
}
