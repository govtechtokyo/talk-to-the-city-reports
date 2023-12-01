import { readFileFromGCS } from '$lib/utils';

export const json = async (
	node: JSONNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	if (!node.data.dirty && node.data.output && node.data.output.length > 0) {
		return node.data.output;
	}

	let contents;
	if (node.data.gcs_path) {
		contents = await readFileFromGCS(node);
		if (typeof contents == 'string') {
			contents = JSON.parse(contents);
		}
	}
	node.data.output = contents;
	node.data.dirty = false;
	return node.data.output;
};

interface JSONData extends BaseData {
	filename: string;
	size_kb: number;
	gcs_path: string;
}

type JSONNode = DGNodeInterface & {
	data: JSONData;
};

export let json_node: JSONNode = {
	id: 'json',
	data: {
		label: 'JSON',
		filename: '',
		size_kb: 0,
		dirty: false,
		gcs_path: '',
		compute_type: 'json_v0',
		input_ids: {}
	},
	position: { x: 100, y: -50 },
	type: 'json_v0'
};
