import React from "react";
import {Counter, CounterTrigger, CounterValue, SwitchList, SelectList} from "../../tUxUIt/components";

export const ProjectEditorPage = (
	<div className="grid text-2r/3r">
		<header className="flex flex-row flex-nowrap gap-2r bg-scnd-1">
			<button className="clip-rebbel-b-015">New</button>
			<button className="clip-rebbel-b-015">Save</button>
			<button className="clip-rebbel-b-015 mr-auto">Open</button>
			<button className="clip-rebbel-b-015">Help</button>
			<button className="clip-rebbel-b-015">About</button>
		</header>

		<main>
			<div className="absolute top-2r left-0 right-0 flex flex-row flew-nowrap justify-around">
				{/* {Project.toolbar} */}
				<div className="cassette-switcher bg-ntrl-8">
					<label><i>A</i></label>
					<label><i>B</i></label>
					<label><i>C</i></label>
				</div>
				<div className="cassette-switcher bg-ntrl-8">
				</div>
			</div>
			{/* {Project.workspace} */}
		</main>
		<aside className="">
			{/* <Tuxit.Collab
				name="sidebar-accordion"
				itemPrototype={class {
					render () {
						return (
							
						);
					}
				}}
			>
				<Tuxit.CollabItem>
					<em>Basic</em>
					<div className="flex">
						<button className="w-1e">I</button>
						<button className="w-1e">P</button>
						<button className="w-1e">
							<i>f</i>
							<i>g</i>
						</button>
					</div>
					<Tuxit.CollabTrigger>v</Tuxit.CollabTrigger>
				</Tuxit.CollabItem>

				<Tuxit.CollabItem>
					<em>Mask</em>
					<div className="cassette-switcher w-100">
						<button><i>0</i></button>
						<button><i>1</i></button>
						<button><i>2</i></button>
						<button><i>3</i></button>
						<button><i>4</i></button>
						<button><i>5</i></button>
						<button><i>6</i></button>
						<button><i>7</i></button>
					</div>
					<Tuxit.CollabTrigger>v</Tuxit.CollabTrigger>
				</Tuxit.CollabItem>
			</Tuxit.Collab> */}
			{/* <section>
				<Tuxit.CheckBox id="workspace-inverse" onChange={value => Project.workspace.setInvertion(value)}>
					<label htmlFor="workspace-preview" className="checkbox-bullet"></label>
					<label htmlFor="workspace-inverse" className="btn"><i className="ticon">m</i></label>
				</Tuxit.CheckBox>

				<Tuxit.CheckBox id="workspace-preview" onChange={value => Project.workspace.setPreviewMode(value)}>
					<label htmlFor="workspace-preview" className="checkbox-bullet"></label>
					<label htmlFor="workspace-preview" className="btn"><i className="ticon">n</i></label>
				</Tuxit.CheckBox>

				<button onClick={Project.workspace.rotateLeft}><i className="ticon">D</i></button>

				<button onClick={Project.workspace.rotateRight}><i className="ticon">E</i></button>
			</section> */}

			<section className="">
				<div className="decoded-wrap">
					{/* <Charmap /> */}
				</div>
				<Counter min="2" max="15" step="3" value="14"/>
				<Counter min="2" max="150" step="3" value="14" className="bg-ntrl-9 clip-rebbel-015 text-ntrl-1">
					<CounterTrigger onMouseDown={({setValue, value, min}) => setValue(Math.max(value - 1, min))}>
						-
					</CounterTrigger>
					Num:
					<span className="text-scnd-3">
						<CounterValue/>
					</span>
					<CounterTrigger onMouseDown={({setValue, value, max}) => setValue(Math.min(value + 1, max))}>
						+
					</CounterTrigger>
					<CounterTrigger onMouseDown={({setValue, value, max}) => setValue(Math.min(value * 2, max))}>
						x2
					</CounterTrigger>
				</Counter>
				{/* <SelectList menu={}/>
				<SelectList menu={}>
					<ListTrigger action={}>-</ListTrigger>
					<ListValue/>
					<ListTrigger action={}>+</ListTrigger>
				</SelectList>
				<SwitchList menu={}/>
				<SwitchList menu={}>
					<ListTrigger action={}>v</ListTrigger>
					<ListValue/>
				</SwitchList> */}
			</section>
		</aside>
	</div>
);