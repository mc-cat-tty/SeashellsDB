import React, {useMemo} from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { LinkHorizontal } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';

const peach = '#fd9b93';
const pink = '#fe6e9e';
const blue = '#03c0dc';
const green = '#26deb0';
const plum = '#71248e';
const lightpurple = '#374469';
const white = '#ffffff';
export const background = '#272b4d';

const defaultMargin = { top: 10, left: 80, right: 80, bottom: 10 };

const rawTree = {
  name: 'Mollusca',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
            {
              name: 'D',
              children: [
                {
                  name: 'D1',
                },
                {
                  name: 'D2',
                },
                {
                  name: 'D3',
                },
              ],
            },
          ],
        },
      ],
    },
    { name: 'Z' },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    },
  ],
};

const Node = ({node}) => {
    const width = 40;
    const height = 20;
    const centerX = -width / 2;
    const centerY = -height / 2;
    const isRoot = node.depth === 0;
    const isParent = !!node.children;

    if (isRoot) return <RootNode node={node} />;
    if (isParent) return <ParentNode node={node} />;

    return (
        <Group top={node.x} left={node.y}>
          <rect
            height={height}
            width={width}
            y={centerY}
            x={centerX}
            fill={background}
            stroke={green}
            strokeWidth={1}
            strokeDasharray="2,2"
            strokeOpacity={0.6}
            rx={10}
            onClick={() => {
              alert(`clicked: ${JSON.stringify(node.data.name)}`);  // TODO
            }}
          />
          <text
            dy=".33em"
            fontSize={9}
            fontFamily="Arial"
            textAnchor="middle"
            fill={green}
            style={{ pointerEvents: 'none' }}
          >
            {node.data.name}
          </text>
        </Group>
    );
}

const ParentNode = ({node}) => {
    const width = 40;
    const height = 20;
    const centerX = -width / 2;
    const centerY = -height / 2;

    return (
        <Group top={node.x} left={node.y}>
          <rect
            height={height}
            width={width}
            y={centerY}
            x={centerX}
            fill={background}
            stroke={blue}
            strokeWidth={1}
            onClick={() => {
              alert(`clicked: ${JSON.stringify(node.data.name)}`);
            }}
          />
          <text
            dy=".33em"
            fontSize={9}
            fontFamily="Arial"
            textAnchor="middle"
            style={{ pointerEvents: 'none' }}
            fill={white}
          >
            {node.data.name}
          </text>
        </Group>
    );
}

const RootNode = ({node}) => (
    <Group top={node.x} left={node.y}>
      <circle r={30} fill="url('#lg')" />
      <text
        dy=".33em"
        fontSize={13}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={plum}
      >
        {node.data.name}
      </text>
    </Group>
);

// const addPositions = (tree, yIndex, yEleNum, yMax) => {
//     tree.x = 200;
//     tree.y = (yMax/(yEleNum+1)) * (yIndex+1);
//     console.log(yIndex, yEleNum, yMax);
//     if (!!tree.children)
//         for (let i in tree.children) {
//             addPositions(tree.children[i], i, tree.children.length, yMax);
//         }
//     return tree;
// };

const SvgTree = ({width, height, margin = defaultMargin}) => {
    const data = useMemo(() => hierarchy(rawTree), []);
    const yMax = height - margin.top - margin.bottom;
    const xMax = width - margin.left - margin.right;


    return width < 10 ? null : (
        <svg width={width} height={height}>
          <LinearGradient id="lg" from={peach} to={pink} />
          <rect width={width} height={height} rx={14} fill={background} />
          <Tree root={data} size={[yMax, xMax]}>
            {tree => (
              <Group top={margin.top} left={margin.left}>
                {tree.links().map((link, i) => (
                  <LinkHorizontal
                    key={`link-${i}`}
                    data={link}
                    stroke={lightpurple}
                    strokeWidth="1"
                    fill="none"
                  />
                ))}
                {tree.descendants().map((node, i) => (
                  <Node key={`node-${i}`} node={node} />
                ))}
              </Group>
            )}
          </Tree>
        </svg>
      );
}


const totalChildren = tree => {
    if (!tree.children)
        return 1;
    let num = 0;
    for (const node of tree.children) {
        num += totalChildren(node);
    }
    return num;
}

const ViewTree = () => {
    const parentRef = React.useRef();
    console.log(totalChildren(rawTree));
    const parentHeight = totalChildren(rawTree, 0)*50;
    const [parentWidth, setParentWidth] = React.useState(100);

    React.useEffect(() => {
        if (parentRef.current) {
            setParentWidth(parentRef.current.offsetWidth);
        }
    }, [parentRef]);

    return(
        <div className="tree" ref={parentRef}>
            <SvgTree width={parentWidth} height={parentHeight}/>
        </div>
    );
}

export default ViewTree;