import styled from "styled-components";
import { Column } from "./types";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0px;
  user-select: none;
`;

export const Header = styled.div<{ columns: Column[] }>`
  display: grid;
  grid-template-rows:    1fr;
  grid-template-columns: ${props => props.columns.map(x => x.width || "1fr").join(' ')} 20px;

  background: #F1F3F4;
  height: 27px;
  border-bottom: 0.5px solid #D8DBDE;
  padding-right: 17px;
  /* overflow-y: scroll; */
`;

export const Body = styled.div<{ columns: Column[] }>`
  /* height: calc(100% - 20px); */
  overflow-y: auto;
  display: grid;
  grid-auto-rows: 21px;
  grid-template-columns: ${props => props.columns.map(x => x.width || "1fr").join(' ')} 25px;
`;

export const ColumnCell = styled.div`
  display: flex;
  justify-content: space-between;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 8px;
  border-left: 1px solid #cdcdd1;

  user-select: none;

  /* cursor: pointer; */

  text-align: left;
  font-weight: 400;
  vertical-align: middle;
  line-height: 25px;
  font-size: 12px;
  padding: 1px 4px;
`;

export const ColumnResizer = styled.div`
  width: 4px;
  cursor: e-resize;
  margin: -1px -4px;

  &:hover {
    background: #bebebe;
  }
`;

export const TRow = styled.div`
  display: contents;
  cursor: pointer;

  &:nth-of-type(2n) > div {
    background-color: #F5F5F5;
  }

  &:hover > div {
    background-color: #F1F6FD;
  }
`;

export const TRowControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Cell = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 22px;
  padding: 0 4px;
`;
