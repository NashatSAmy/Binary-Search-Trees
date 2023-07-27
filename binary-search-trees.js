const node = (d) => {
  left = right = null;
  data = d;
  return {
    data,
    left,
    right,
  };
};

const tree = (arr) => {
  const buildTree = (arr) => {
    arr = sortAndClean(arr);
    const mid = Math.floor(arr.length / 2);
    const midItem = arr[mid];
    if (arr.length == 0) return null;
    const rootNode = node(midItem);
    rootNode.left = buildTree(arr.slice(0, mid));
    rootNode.right = buildTree(arr.slice(mid + 1));
  
    return rootNode;
  };
  
  const sortAndClean = (arr) => {
    let cleanArr = [];
    arr.forEach((i) => (cleanArr.includes(i) ? "" : cleanArr.push(i)));
    return cleanArr.sort((a, b) => a - b);
  };

  return {
    root: buildTree(arr),
    buildTree,
    prettyPrint (node = this.root, prefix = "", isLeft = true) {
      if (node === null) {
        return;
      }
      if (node.right !== null) {
        this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
      }
      console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
      if (node.left !== null) {
        this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
      }
    },
    insert (value, tree = this.root) {
      if (tree == null) return
      value > tree.data ? tree.right === null ? tree.right = node(value) : this.insert(value, tree.right) : null
      value < tree.data ? tree.left === null ? tree.left = node(value) : this.insert(value, tree.left) : null
    },
    remove (value, tree = this.root) {
      const nodeCase = ((node = this.find(value, tree)) => {
        if (node.right == null && node.left == null) return "No children";
        else if (node.right == null || node.left == null) return "One child";
        else return "Two children";
      })();
      const findParent = (v, branch) => {
        if (branch == null) return "Error: TARGET VALUE NOT FOUND!!";
        else if (v == (branch.right == null ? "" : branch.right.data))
          return { node: branch, side: "right" };
        else if (v == (branch.left == null ? "" : branch.left.data))
          return { node: branch, side: "left" };
        else if (v > branch.data) return findParent(v, branch.right);
        else if (v < branch.data) return findParent(v, branch.left);
      };
      const findNextBiggest = (branch) => {
        if (branch.left == null) {
          const tempInfo = { ...branch };
          this.remove(branch.data, find(value, tree).right);
          return tempInfo.data;
        } else return findNextBiggest(branch.left);
      };
      if (nodeCase == "No children") {
        const parent = findParent(value, tree);
        delete parent.node[parent.side];
        parent.node[parent.side] = null;
      } else if (nodeCase == "One child") {
        const node = this.find(value, tree);
        node.right === null
          ? (node.data = node.left.data)
          : (node.data = node.right.data);
        node.right === null ? delete node.left : delete node.right;
        node.right === null ? (node.left = null) : (node.right = null);
      } else if (nodeCase == "Two children") {
        const node = this.find(value, tree);
        node.data = findNextBiggest(node.right);
      } else return "Error: TARGET NOT FOUND!!!";
    },
    find (value, tree = this.root) {
      const goRight = (v, branch) => {
        if (branch == null) return "Error: TARGET VALUE NOT FOUND!!";
        else if (v == branch.data) return branch;
        return v > branch.data ? goRight(v, branch.right) : goLeft(v, branch.left);
      };
      const goLeft = (v, branch) => {
        if (branch == null) return "Error: TARGET VALUE NOT FOUND!!";
        else if (v == branch.data) return branch;
        return v < branch.data ? goLeft(v, branch.left) : goRight(v, branch.right);
      };
      return value == tree.data
        ? tree
        : value > tree.data
        ? goRight(value, tree.right)
        : goLeft(value, tree.left);
    },
    levelOrder (b = 0, a = this.root, c = []) {
      const traverse = (f, node, q) => {
        if (node == undefined) return [];
        q.length == 0 ? q.push(node) : "";
        node.left !== null ? q.push(node.left) : "";
        node.right !== null ? q.push(node.right) : "";
        q = q.slice(1);
        if (f == 0) return [node.data, ...traverse(f, q[0], q)];
        else {
        let processed = f(node);
        traverse(f, q[0], q);
        return processed;
      }
      }
      return traverse(b,a,c)
    },
    inOrder (f = 0, node = this.root) {
      const leftST = node.left !== null ? this.inOrder(f, node.left) : "";
      let processed = f == 0 ? "" : f(node);
      const rightST = node.right !== null ? this.inOrder(f, node.right) : "";
      if (f == 0) return [...leftST, node.data, ...rightST];
      else return processed;
    },
    preOrder (f = 0, node = this.root) {
      let processed = f == 0 ? "" : f(node);
      const leftST = node.left !== null ? this.preOrder(f, node.left) : "";
      const rightST = node.right !== null ? this.preOrder(f, node.right) : "";
      if (f == 0) return [node.data, ...leftST, ...rightST];
      else return processed;
    },
    postOrder (f = 0, node = this.root) {
      const leftST = node.left !== null ? this.inOrder(f, node.left) : "";
      const rightST = node.right !== null ? this.inOrder(f, node.right) : "";
      let processed = f == 0 ? "" : f(node);
      if (f == 0) return [...leftST, ...rightST, node.data];
      else return processed;
    },
    hight (node = this.root) {
      if (node.left == null && node.right == null) return 0;
      const leftST = node.left !== null ? this.hight(node.left) : "";
      const rightST = node.right !== null ? this.hight(node.right) : "";
      return 1 + (+leftST > +rightST ? +leftST : +rightST);
    },
    depth (node = this.root) {
      const leftST = node.left !== null ? this.depth(node.left) : "";
      const rightST = node.right !== null ? this.depth(node.right) : "";
      return 1 + (+leftST > +rightST ? +leftST : +rightST);
    },
    
    isBalanced (tree = this.root) {
      if (tree == null) return ""
      const leftBH = tree.left !== null ? this.hight(tree.left) : 0;
      const rightBH = tree.right !== null ? this.hight(tree.right) : 0;
      let xxx = Math.abs((leftBH - rightBH) - (+this.isBalanced(tree.right) - +this.isBalanced(tree.left)))
      if (xxx < 2) {
        return xxx >= 0 
      } return "false"
    },
    
    reBalance (tree = this.root) {
      return this.buildTree(this.preOrder());
    },
  };
};

const arrOf100 = () => {
  let arr = []
  while (arr.length !== 100) {
    arr.push(Math.floor(Math.random() * 100000))
  }
  return arr
}

const driver = () => {
  const arr = arrOf100()
  let bST = tree(arr);
  const balanced = bST.isBalanced()
  if (balanced == true) {
    bST.levelOrder((node) => console.log(node.data))
    bST.inOrder((node) => console.log(node.data))
    bST.preOrder((node) => console.log(node.data))
    bST.postOrder((node) => console.log(node.data))
    console.log(bST.isBalanced())
    const newInserts = arrOf100();
    for (i = 0; i < 100; i++) {
      bST.insert(newInserts[i])
    };
    console.log(bST.isBalanced())
    bST.root = bST.reBalance()
    console.log(bST.isBalanced())
    bST.levelOrder((node) => console.log(node.data))
    bST.inOrder((node) => console.log(node.data))
    bST.preOrder((node) => console.log(node.data))
    bST.postOrder((node) => console.log(node.data))
  } 
}

driver()


