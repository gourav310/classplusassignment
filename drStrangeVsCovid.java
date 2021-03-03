import java.io.*; // for handling input/output
import java.util.*; // contains Collections framework
//
//i am using dijkstra algorithm and modifining it 
class Main {
    // class edge will represent universe(start) and its neighbrs 
    public static class Edge{
        int start;
        int nbr;
        int wt;
        Edge(int start,int nbr ,int wt){
            this.start=start;
            this.nbr=nbr;
            this.wt=wt;
        }
    }
	public static void main (String[] args) {
        //taking input
        Scanner sc = new Scanner(System.in);
        //n =  no of universe
        int n = sc.nextInt();
        //m= no of portals 
        int m = sc.nextInt();
        //graph to represent whole group of universe
        ArrayList<Edge>[] graph = new ArrayList[n+1];
        for(int i=0;i<n+1;i++){
            graph[i]= new ArrayList<>();
        }
        for(int i=0;i<m;i++){
            int u =  sc.nextInt();
            int v =  sc.nextInt();
            int wt = sc.nextInt();
            graph[u].add(new Edge(u,v,wt));
            graph[v].add(new Edge(u,v,wt));
        }
        //taking input for demons list 
        HashSet<Integer>[] demons= new HashSet[n+1];
        for(int i=0;i<n;i++){
            demons[i+1]= new HashSet<Integer>();
            int len = sc.nextInt();
            while((len--)>0){
                int val = sc.nextInt();
                demons[i+1].add(val);
            }
        }
        // for(int i=0;i<n;i++){
        //     System.out.println(demons[i]);
        // }
        dijkstra(graph,n,demons);             // Your code here
	}
    public static void dijkstra(ArrayList<Edge>[] graph,int n,HashSet<Integer>[] demons){
        PriorityQueue<Pair> pq = new PriorityQueue<>();
        pq.add(new Pair(1,0,"1 "));
        boolean visited[] = new boolean[n+1];
        while(!pq.isEmpty()){
            Pair curr = pq.remove();
            if(visited[curr.vertex]){
                continue;
            }
            visited[curr.vertex]=true;
            if(curr.vertex==n){
                 System.out.println(curr.wttn+" mins by route "+curr.route);
                 return;
            }
            for(Edge e: graph[curr.vertex]){
                if(!visited[e.nbr]){
                    //calculate total  time 
                    // totalTime= curr weight till now(time till now)+demons wasting time
                    int totalTime=curr.wttn;
                    int currVertex = curr.vertex;
                    while(demons[currVertex].contains(totalTime)){
                        totalTime++;
                        // System.out.println(totalTime);
                    }
                    pq.add(new Pair(e.nbr,totalTime+e.wt,curr.route+e.nbr+" "));
                }
            }
        }
        
    } 
    //class pair will represent vertex(universe) and min waitng  time to react there
    public static class Pair implements Comparable<Pair>{
        //vertex
        int vertex;
        //timme consumed  till  now(weight in dijkstra)
        int wttn;
        String route;
        Pair(int v,int wt,String route){
            this.vertex=v;
            this.wttn=wt;
            this.route=route;
        }
        //comparator function for heap(PriorityQueue)
        public int compareTo(Pair o){
            return this.wttn-o.wttn;
        }
    } 
   
    
}