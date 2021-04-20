import { h } from 'preact';
import { PopupMessages } from '~/message';
import styled from 'styled-components';

/* -------------------- DOM -------------------- */
type UiProps = {
  className?: string;
  sushiData: PopupMessages['payload'];
};

const UiComponent = (props: UiProps) => {
  return (
    <div className={props.className}>
      {props.sushiData.setMenus.length === 0 && <div>データがありません</div>}
      {props.sushiData.setMenus.length > 0 && (
        <table>
          <thead>
            <tr>
              <th />
              {props.sushiData.setMenus.map((menu) => (
                <th>{menu.setName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(props.sushiData.materials)
              .sort((a, b) => (a[1] < b[1] ? 1 : -1))
              .map(([material]) => (
                <tr>
                  <td className="material">{material}</td>
                  {props.sushiData.setMenus.map((setMenu) => {
                    const isInclude = setMenu.materials.includes(material);
                    return (
                      <td className={isInclude ? 'available' : 'unavailable'}>
                        {isInclude ? '●' : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ------------------- Style ------------------- */
const borderStyle = `solid 1px rgb(127 127 127)`;
const StyledUi = styled(UiComponent)`
  table {
    border: ${borderStyle};
    border-collapse: collapse;
  }

  th {
    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
  }

  th,
  td {
    border: ${borderStyle};
  }

  td {
    &.material {
      min-width: 125px;
    }

    &.unavailable {
      text-align: center;
    }

    &.available {
      font-size: 1.4rem;
      text-align: center;
    }
  }
`;

/*---------------------------------------------- */
export { StyledUi as List };
