export const cafeMenuActions = {
  deleteOriginal: true,
  text: '카페 메뉴 메신저',
  responseType: 'ephemeral',
  attachments: [
    {
      title: '액션 리스트',
      actions: [
        {
          name: 'actions_list',
          text: '액션을 선택해주세요.',
          type: 'select',
          options: [
            {
              text: '카페 메뉴 등록하기',
              value: 'register',
            },
            {
              text: '전체 카페 이름 조회하기',
              value: 'getAll',
            },
            {
              text: '카페 메뉴 조회하기',
              value: 'getOne',
            },
            {
              text: '카페 메뉴 수정하기',
              value: 'update',
            },
            {
              text: '카페 메뉴 삭제하기',
              value: 'delete',
            },
            {
              text: '카페로 투표하기',
              value: 'vote',
            },
          ],
        },
      ],
    },
  ],
};
